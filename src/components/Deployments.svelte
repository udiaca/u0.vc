<script lang="ts">
  export let deployments: CFPagesDeployment[] = [];
</script>

<div class="container">
  {#each deployments as deployment, index (deployment.id)}
    <div class="deployment">
      <div class="links">
        {#if deployment.aliases !== null && deployment.aliases.length}
          {#each deployment.aliases as alias, index (alias)}
            <a class="alias" href={alias} target="_blank" rel="noreferrer"
              >{alias}</a
            >
          {/each}
        {/if}
        <a href={deployment.url} target="_blank" rel="noreferrer"
          >{deployment.url}</a
        >
      </div>
    </div>
  {/each}
</div>

<style>
  .container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1em;
    max-width: 100vw;
    width: calc(100% - 20px);
  }

  .deployment {
    background-color: var(--mute-background-color);
    mix-blend-mode: hard-light;
    color: var(--emph-color);
    border-radius: 10px;
    display: flex;
    height: 260px;
    flex-direction: column;
    position: relative;
    width: 300px;
  }

  .links {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
    padding-top: 0.5rem;
    text-align: center;
  }

  .alias:before {
    content: "\2731";
  }
</style>
