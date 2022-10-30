<script lang="ts">
  export let deployments: CFPagesDeployment[] = [];
  export let commitPrefixUrl: string =
    "https://github.com/udiaca/u0.vc/commit/";
  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "long",
  });
</script>

<div class="container">
  {#each deployments as dep, index (dep.id)}
    <div class="deployment">
      <div class="links">
        {#if dep.aliases !== null && dep.aliases.length}
          {#each dep.aliases as alias, index (alias)}
            <a class="alias" href={alias} target="_blank" rel="noreferrer"
              >{alias}</a
            >
          {/each}
        {/if}
        <a href={dep.url} target="_blank" rel="noreferrer">{dep.url}</a>
      </div>
      <div class="deployment-type">
        <span class="label"><code>{dep.environment}</code></span>
        <code>{dep.deployment_trigger.type}</code>
      </div>
      <a href={commitPrefixUrl + dep.deployment_trigger.metadata.commit_hash}>
        <code><pre>{dep.deployment_trigger.metadata.commit_message}</pre></code>
      </a>
      <dl>
        <dt><code>modified_on</code></dt>
        <dd><span>{formatter.format(new Date(dep.modified_on))}</span></dd>
        <dt><code>created_on</code></dt>
        <dd><span>{formatter.format(new Date(dep.created_on))}</span></dd>
      </dl>
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
    color: var(--emph-color);
    border-radius: 10px;
    display: flex;
    height: 260px;
    flex-direction: column;
    position: relative;
    width: 300px;
    padding: 0.5rem;
    gap: 0.2rem;
    overflow-y: auto;
  }

  @media only screen and (max-width: 599px) {
    .deployment {
      width: 100%;
    }
  }
  @media only screen and (min-width: 600px) {
    .deployment {
      width: 45%;
    }
  }
  @media only screen and (min-width: 889px) {
    .deployment {
      width: 30%;
    }
  }
  @media only screen and (min-width: 1200px) {
    .deployment {
      width: 300px;
    }
  }

  .links {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    padding-top: 0.5rem;
  }

  .alias:before {
    content: "\2731";
  }

  .deployment-type {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }

  .label {
    width: fit-content;
    align-items: center;
    background-color: var(--label-primary-color);
    border-radius: 1rem;
    box-sizing: border-box;
    display: inline-flex;
    padding: 0.3rem 0.7rem;
    user-select: none;
    white-space: nowrap;
  }
</style>
