<script lang="ts">
export let text: string;
export let tooltipText: string;
</script>
<div class="tooltip">
  {text}
  <span class="tooltiptext">{tooltipText}</span>
</div>
<style>
  /* Tooltip container */
  .tooltip {
    position: relative;
    display: inline-block;
    text-decoration: underline 1px dotted var(--emph-color); /* If you want dots under the hoverable text */
    cursor: help;
  }

  /* Tooltip text */
  .tooltip .tooltiptext {
    visibility: hidden;
    opacity: 0;

    width: 100%;
    background-color: var(--label-primary-color);
    color: var(--color);
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;

    transition: opacity 0.5s ease-in;

    position: absolute;
    z-index: 1;
    top: 100%;
    left: 50%;
    margin-left: -50%;
  }

  .tooltip .tooltiptext::after {
    content: ' ';
    position: absolute;
    left: 50%;
    bottom: 100%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent var(--label-primary-color) transparent;
  }

  /* Show the tooltip text when you mouse over the tooltip container */
  .tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
  }
</style>
