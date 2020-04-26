import { toggleCommonFunction } from "../registerMethods";
export default function transformer(file, api, options) {
  const toggleName = options.toggleName;
  const flag = options.flag;
  const j = api.jscodeshift;
  j.use(toggleCommonFunction);
  const root = j(file.source);
  root
    .getTogglesComment([options.commentStart, options.commentEnd])
    .getTogglePositions(toggleName)
    .removeToggleSection(flag)
    .cleanComments()
    .cleanEmptyJsxExpression();
  return root.toSource();
}
