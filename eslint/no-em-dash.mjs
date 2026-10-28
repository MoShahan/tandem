const EM_DASH = "\u2014";
const HYPHEN = "-";

const checkNode = (context, node) => {
  const sourceCode = context.sourceCode;
  const text = sourceCode.getText(node);
  const start = node.range[0];
  let from = 0;
  let index = text.indexOf(EM_DASH, from);

  while (index !== -1) {
    const rangeStart = start + index;
    const rangeEnd = rangeStart + EM_DASH.length;

    context.report({
      node,
      loc: {
        start: sourceCode.getLocFromIndex(rangeStart),
        end: sourceCode.getLocFromIndex(rangeEnd),
      },
      messageId: "noEmDash",
      fix: (fixer) => fixer.replaceTextRange([rangeStart, rangeEnd], HYPHEN),
    });

    from = index + EM_DASH.length;
    index = text.indexOf(EM_DASH, from);
  }
};

export const noEmDashRule = {
  meta: {
    type: "layout",
    docs: {
      description: "Disallow em dashes (—); use a hyphen (-) instead",
    },
    fixable: "code",
    messages: {
      noEmDash: "Replace the em dash (—) with a hyphen (-).",
    },
    schema: [],
  },
  create(context) {
    return {
      Literal(node) {
        checkNode(context, node);
      },
      TemplateElement(node) {
        checkNode(context, node);
      },
      JSXText(node) {
        checkNode(context, node);
      },
      Program() {
        for (const comment of context.sourceCode.getAllComments()) {
          checkNode(context, comment);
        }
      },
    };
  },
};

export const tandemEslintPlugin = {
  rules: {
    "no-em-dash": noEmDashRule,
  },
};
