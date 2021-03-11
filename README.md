# version-checker

Check package version against the base branch in pull requests.
Fails the build if package version the same or older.

Based on kriasoft/check-version GitHub action:
https://github.com/marketplace/actions/check-version

## build

Checker is automatically built with pre-commit hook, but if needed, manual build is possible: </br>
`npm run build`

## usage

```
- name: Check version
  uses: SADEInnovations/version-checker@initial
  id: checker
```

You can also set path to package file, if not in repository root:

```
      - name: Check version
        uses: SADEInnovations/version-checker
        id: checker
        with:
          path: services/data-service
```

You can fetch package version in following steps:
```
      - name: Results
        run: echo "Version is ${{ steps.checker.outputs.version }}"
```
