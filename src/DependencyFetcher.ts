import {
  Cache,
  Configuration,
  Manifest,
  Package,
  Project,
  structUtils,
  ThrowReport,
  Workspace,
} from "@yarnpkg/core"
import { suggestUtils } from "@yarnpkg/plugin-essentials"
import { getHomepageURL } from "./utils"

interface FetchOptions {
  pkg: Package
  range: string
  url: boolean
}

export class DependencyFetcher {
  constructor(
    private configuration: Configuration,
    private project: Project,
    private workspace: Workspace,
    private cache: Cache
  ) {}

  async fetch({ pkg, range, url }: FetchOptions) {
    const candidatePromise = suggestUtils.fetchDescriptorFrom(pkg, range, {
      cache: this.cache,
      preserveModifier: false,
      project: this.project,
      workspace: this.workspace,
    })

    const urlPromise = url ? this.fetchURL(pkg) : Promise.resolve(undefined)
    const [candidate, homepageURL] = await Promise.all([
      candidatePromise,
      urlPromise,
    ])

    if (!candidate) {
      const name = structUtils.prettyIdent(this.configuration, pkg)
      throw new Error(`Could not fetch candidate for ${name}.`)
    }

    return { url: homepageURL, version: candidate.range }
  }

  private async fetchURL(pkg: Package) {
    const fetcher = this.configuration.makeFetcher()
    const fetchResult = await fetcher.fetch(pkg, {
      cache: this.cache,
      checksums: this.project.storedChecksums,
      fetcher,
      project: this.project,
      report: new ThrowReport(),
      skipIntegrityCheck: true,
    })

    let manifest: Manifest | undefined
    try {
      manifest = await Manifest.find(fetchResult.prefixPath, {
        baseFs: fetchResult.packageFs,
      })
    } finally {
      fetchResult.releaseFs?.()
    }

    return getHomepageURL(manifest)
  }
}
