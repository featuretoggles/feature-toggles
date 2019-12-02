const babel = require("@babel/core");
const plugin = require("../");

const basicExample = `
var foo = 1;
if (foo) {
    //toggleStart(feature-1)
    console.log(foo);
    //toggleEnd(feature-1)
}

`;

it("SNAPSHOT- plugin testing for basic code", () => {
  const { code } = babel.transform(basicExample, {
    plugins: [
      [
        plugin,
        {
          toggleName: "ft2",
          dir: __dirname
        }
      ]
    ]
  });
  expect(code).toMatchSnapshot();
});

it("AST- plugin testing for basic code", () => {
  const { ast } = babel.transform(basicExample, {
    ast: true,
    plugins: [
      [
        plugin,
        {
          toggleName: "ft2",
          dir: __dirname
        }
      ]
    ]
  });
  const expected = {
    comments: [
      {
        end: 53,
        loc: { end: { column: 28, line: 4 }, start: { column: 4, line: 4 } },
        start: 29,
        type: "CommentLine",
        value: "toggleStart(feature-1)"
      },
      {
        end: 102,
        loc: { end: { column: 26, line: 6 }, start: { column: 4, line: 6 } },
        start: 80,
        type: "CommentLine",
        value: "toggleEnd(feature-1)"
      }
    ],
    end: 106,
    errors: [],
    innerComments: undefined,
    leadingComments: undefined,
    loc: { end: { column: 0, line: 9 }, start: { column: 0, line: 1 } },
    program: {
      body: [
        {
          declarations: [
            {
              end: 12,
              id: {
                end: 8,
                innerComments: undefined,
                leadingComments: undefined,
                loc: {
                  end: { column: 7, line: 2 },
                  identifierName: "foo",
                  start: { column: 4, line: 2 }
                },
                name: "foo",
                start: 5,
                trailingComments: undefined,
                type: "Identifier"
              },
              init: {
                end: 12,
                extra: { raw: "1", rawValue: 1 },
                innerComments: undefined,
                leadingComments: undefined,
                loc: {
                  end: { column: 11, line: 2 },
                  start: { column: 10, line: 2 }
                },
                start: 11,
                trailingComments: undefined,
                type: "NumericLiteral",
                value: 1
              },
              innerComments: undefined,
              leadingComments: undefined,
              loc: {
                end: { column: 11, line: 2 },
                start: { column: 4, line: 2 }
              },
              start: 5,
              trailingComments: undefined,
              type: "VariableDeclarator"
            }
          ],
          end: 13,
          innerComments: undefined,
          kind: "var",
          leadingComments: undefined,
          loc: { end: { column: 12, line: 2 }, start: { column: 0, line: 2 } },
          start: 1,
          trailingComments: undefined,
          type: "VariableDeclaration"
        },
        {
          alternate: null,
          consequent: {
            body: [],
            directives: [],
            end: 104,
            innerComments: undefined,
            leadingComments: undefined,
            loc: { end: { column: 1, line: 7 }, start: { column: 9, line: 3 } },
            start: 23,
            trailingComments: undefined,
            type: "BlockStatement"
          },
          end: 104,
          innerComments: undefined,
          leadingComments: undefined,
          loc: { end: { column: 1, line: 7 }, start: { column: 0, line: 3 } },
          start: 14,
          test: {
            end: 21,
            innerComments: undefined,
            leadingComments: undefined,
            loc: {
              end: { column: 7, line: 3 },
              identifierName: "foo",
              start: { column: 4, line: 3 }
            },
            name: "foo",
            start: 18,
            trailingComments: undefined,
            type: "Identifier"
          },
          trailingComments: undefined,
          type: "IfStatement"
        }
      ],
      directives: [
        {
          type: "Directive",
          value: { type: "DirectiveLiteral", value: "use strict" }
        }
      ],
      end: 106,
      innerComments: undefined,
      interpreter: null,
      leadingComments: undefined,
      loc: { end: { column: 0, line: 9 }, start: { column: 0, line: 1 } },
      sourceType: "script",
      start: 0,
      trailingComments: undefined,
      type: "Program"
    },
    start: 0,
    trailingComments: undefined,
    type: "File"
  };
  expect(ast).toEqual(expected);
});
