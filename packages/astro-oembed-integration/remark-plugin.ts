import { type Node, select, selectAll } from 'unist-util-select';
import { findEndpointUrl } from 'astro-oembed/providers';
import { parse as parseJs } from 'acorn';

const COMPONENT_NAME = 'AuToImPoRtEdAstroOembed';

type Link = Node & {
  url?: string;
  children?: Node[];
};

/** Build an mdxjsEsm node that injects the Oembed import into an MDX file. */
function buildImportNode() {
  const js = `import { Oembed as ${COMPONENT_NAME} } from 'astro-oembed'`;
  return {
    type: 'mdxjsEsm',
    value: '',
    data: {
      estree: {
        ...parseJs(js, { ecmaVersion: 'latest', sourceType: 'module' }),
        type: 'Program',
        sourceType: 'module',
      },
    },
  };
}

function transformer(tree: Node, vfile: { basename?: string }) {
  // mdxJsxFlowElement nodes are only valid in MDX files, not plain Markdown.
  if (!vfile.basename?.endsWith('.mdx')) return tree;

  let didTransform = false;
  const paragraphs = selectAll('paragraph', tree);
  paragraphs.forEach((paragraph) => {
    const link = select(':scope > link:only-child', paragraph) as Link | undefined;
    if (!link) return;

    const { url, children } = link;
    if (!url || !url.startsWith('http')) return;
    if (!children || children.length !== 1) return;

    const child = children[0];
    if (
      !child ||
      child.type !== 'text' ||
      !('value' in child) ||
      child.value !== url
    ) {
      return;
    }

    if (!findEndpointUrl(url)) return;

    const component = {
      type: 'mdxJsxFlowElement',
      name: COMPONENT_NAME,
      attributes: [{ type: 'mdxJsxAttribute', name: 'url', value: url }],
      children: [],
    };
    // @ts-expect-error Overriding the paragraph node type with MDX element data.
    for (const key in component) paragraph[key] = component[key];
    didTransform = true;
  });

  if (didTransform) {
    // Inject the import once at the top of the file.
    // @ts-expect-error unist Node root has children but the generic type doesn't expose them.
    (tree as { children: unknown[] }).children.unshift(buildImportNode());
  }

  return tree;
}

export default function createPlugin() {
  return function attacher() {
    return transformer;
  };
}
