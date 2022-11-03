<script lang="ts">
  import { understanding } from "../../utils/svelteStores";
</script>

<dl>
  <dt id="u" class:emphasized={$understanding.includes("u")}>U</dt>
  <dd>niverse</dd>
  <dt id="d" class:emphasized={$understanding.includes("d")}>D</dt>
  <dd>ream</dd>
  <dt id="i" class:emphasized={$understanding.includes("i")}>I</dt>
  <dd>You</dd>
  <dt id="a" class:emphasized={$understanding.includes("a")}>A</dt>
  <dd>wareness</dd>
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
