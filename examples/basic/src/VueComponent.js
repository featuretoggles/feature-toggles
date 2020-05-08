let template;
/**
 * When we want to add a new feature we should wrap the old code with a "old-" prefix toggleName.
 * This will be easy to remove code automatically using codemod.
 */
/* toggleStart(old-feature-3) */
template = "<a> Old code </a>";
/* toggleEnd(old-feature-3) */
/* toggleStart(feature-3) */
template =
  '<button v-on:click="count++">You clicked me {{ count }} times.</button>';
/* toggleEnd(feature-3) */
Vue.component("button-counter", {
  data: function() {
    return {
      count: 0
    };
  },
  template
});
