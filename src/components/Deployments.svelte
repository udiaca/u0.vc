<script lang="ts">
  import DateDelta from './DateDelta.svelte'

  export let deployments: CFPagesDeployment[] = []
  export let locales: string[] = []
  export let commitPrefixUrl: string = 'https://github.com/udiaca/u0.vc/commit/'
</script>

<div class="container">
  {#each deployments as dep, index (dep.id)}
    <div class="deployment">
      <span class="environment">{dep.environment}</span>
      <code>{dep.deployment_trigger.type}</code>
      <code>{dep.latest_stage.name}</code>
      <code>{dep.latest_stage.status}</code>
      {#if dep.aliases !== null && dep.aliases.length}
        {#each dep.aliases as alias, index (alias)}
          <a
            class="deployment-link alias"
            href={alias}
            target="_blank"
            rel="noreferrer">{alias}</a
          >
        {/each}
      {/if}
      <a class="deployment-link" href={dep.url} target="_blank" rel="noreferrer"
        >{dep.url}</a
      >
      <div class="full-width">
        <span>
          <code>modified_on</code>
          <DateDelta {locales} toDelta={new Date(dep.modified_on)} />
        </span>
      </div>
      <div class="full-width">
        <span>
          <code>created_on</code>
          <DateDelta {locales} toDelta={new Date(dep.created_on)} />
        </span>
      </div>
      <div class="full-width">
        <code>
          <pre class="no-margin">{dep.deployment_trigger.metadata
              .commit_message}</pre>
        </code>
      </div>
      <a href={commitPrefixUrl + dep.deployment_trigger.metadata.commit_hash}>
        github commit
      </a>
      <!-- <code>
        <pre>{JSON.stringify(dep, undefined, 2)}</pre>
      </code> -->
    </div>
  {/each}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
  }
  .deployment {
    display: flex;
    flex-wrap: wrap;
    column-gap: 0.5em;
    row-gap: 0.5em;
    position: sticky;
    top: 0;
    background-color: var(--background-color);
    max-height: 100vh;
    overflow-y: scroll;
  }
  .deployment:not(:first-child) {
    padding-bottom: 0.5em;
    border-top: 1px double var(--emph-color);
  }
  .deployment:not(:last-child) {
    padding-bottom: 0.5em;
  }
  span.environment {
    padding: 4px 8px;
    background-color: var(--emph-color);
    border-radius: 0px 0px 4px 4px;
    display: inline-flex;
    white-space: nowrap;
    user-select: none;
    align-items: center;
    box-sizing: border-box;
    line-height: 1;
  }

  .deployment:first-child span.environment {
    border-radius: 4px;
  }

  div.full-width {
    width: 100vw;
  }

  .no-margin {
    margin: 0;
  }
</style>
