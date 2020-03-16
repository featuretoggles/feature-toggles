export default function transformer(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);
  root.find(j.JSXEmptyExpression).forEach(path => {
    path.parentPath.replace();
  });
  return root.toSource();
}
