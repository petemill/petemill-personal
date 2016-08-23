const ignoredSearchPaths = ['/404'];

export function GetPagesInPath(allPages, path) {

  //filter to only provided path, and ignore some system paths
  const pathPages = allPages.filter(page =>
    //filter: none (opposite of some) of the ignored paths match the page path
    !ignoredSearchPaths.some(ignoredPath => page.path.includes(ignoredPath))
    //filter: page path matches the path we're looking for
    && page.file.dirname.split('/')[0] === path);
  //done
  return pathPages;
}
