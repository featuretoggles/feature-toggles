export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);
  root.find(j.JSXEmptyExpression).forEach(path => {
    if (!(path.get("innerComments").value || []).length) {
      path.parentPath.replace();
    }
  });
  return root.toSource();
}
