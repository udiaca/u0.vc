<script lang="ts">
  export let clientId: string;
  const GITHUB_OAUTH = 'https://github.com/login/oauth/authorize'
  const params = new URLSearchParams({
    'client_id': clientId,
    'redirect_uri': 'https://u0.vc/api/auth/github/callback',
  }).toString()

  const url = new URL(GITHUB_OAUTH + '?' + params);
</script>
<a href="{url.toString()}">GitHub OAuth2</a>