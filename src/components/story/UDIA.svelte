<script lang="ts">
import { understanding } from '../../utils/svelteStores';

let understandingValue: string;
understanding.subscribe(value => understandingValue = value)

</script>

<!-- nit: there must be a better way to do this -->
<dl>
  <dt id="u" class:emphasized="{understandingValue.includes("u")}">U</dt><dd>niverse</dd>
  <dt id="d" class:emphasized="{understandingValue.includes("d")}">D</dt><dd>ream</dd>
  <dt id="i" class:emphasized="{understandingValue.includes("i")}">I</dt><dd>You</dd>
  <dt id="a" class:emphasized="{understandingValue.includes("a")}">A</dt><dd>wareness</dd>
</dl>
<style>
  dl {
    display: flex;
    flex-wrap: wrap;
    cursor: pointer;
  }
  dt {
    font-size: 10vh;
    transition-property: font-size;
    transition-duration: 4s;
    text-align: right;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  dt:hover {
    font-size: 1em;
  }
  dd {
    margin-left: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .emphasized {
    color: rebeccapurple;
  }
</style>