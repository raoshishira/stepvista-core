<script lang="ts">
  import katex from 'katex';
  import 'katex/dist/katex.min.css';

  let { template, values = {} } = $props();

  // Live Interpolation: $|\vec{A}| = \sqrt{Ax^2 + Ay^2} => \sqrt{3^2 + 4^2}$
  let renderedMath = $derived.by(() => {
    let finalFormula = template;
    for (const [key, val] of Object.entries(values as Record<string, string | number>)) {
      finalFormula = finalFormula.replace(`{${key}}`, val.toString());
    }
    return katex.renderToString(finalFormula, { displayMode: true, throwOnError: false });
  });
</script>

<div class="sv-math-render math-container p-4 bg-slate-50 rounded-xl overflow-x-auto shadow-inner">
  {@html renderedMath}
</div>
