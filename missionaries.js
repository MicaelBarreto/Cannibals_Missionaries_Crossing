var data = [
  {
    id: 0,
    leftSideCannibals: 3,
    leftSideMissionaries: 3,
    rightSideCannibals: 0,
    rightSideMissionaries: 0,
    voyage: {cannibals: 0, missionaries: 0, side: 'left'},
    isPossible: true
  }
]

var idCount = 1;
var solution;

function addNodesToTree(obj, lastState) {
  return obj.map(state => {
    if(state.id === lastState.id) {
      state === lastState;
    }

    if('children' in state) {
      addNodesToTree(state.children, state);
    }

    return state;
  });
}

function verifyDuplication(node, tree) {
  var found = false;
  
  var path = getPath(tree, node.id);
  var pathCount = 0;

  function travelPath(tree) {
    var state = tree.find(state => state.id === path[pathCount]);    
    pathCount++;

    if(state.id !== node.id) {
      if(
        (state.leftSideCannibals === node.leftSideCannibals ||
        state.leftSideMissionaries === node.leftSideMissionaries ||
        state.rightSideCannibals === node.rightSideCannibals ||
        state.rightSideMissionaries === node.rightSideMissionaries) &&
        (
          state.voyage.side === node.voyage.side &&
          state.voyage.cannibals === node.voyage.cannibals &&
          state.voyage.missionaries === node.voyage.missionaries
        )
      ) found = true;

      if('children' in state && !found) {
          travelPath(state.children);
      }
    }
  }

  travelPath(tree);
  return found;
}

function populateTree(lastState, tree) {
  var newNodes = populateNodes(lastState);
  
  if(newNodes) {
    lastState.children = newNodes;
    
    tree = addNodesToTree(tree, lastState);

    newNodes.map(node => {
      var verify = verifyDuplication(node, tree);

      if(node.rightSideCannibals === 3 && node.rightSideMissionaries === 3)
        solution = node.id;

      if(!verify && node.isPossible) {
        populateTree(node, tree);
      }
    });
  }

  return tree;
}

function populateNodes(state) {
  var combinations;
  
  if(state.voyage.side == 'left') {
    combinations = voyageCombination(state.leftSideCannibals, state.leftSideMissionaries);
  } else {
    combinations = voyageCombination(state.rightSideCannibals, state.rightSideMissionaries);
  }

  if(combinations)
    return combinations.map(combination => {
      var childState = mountChildrenState(
        state.leftSideCannibals, 
        state.leftSideMissionaries, 
        state.rightSideCannibals, 
        state.rightSideMissionaries, 
        {...combination, side: state.voyage.side === 'left' ? 'right' : 'left'}, 
        state.id);

        return childState;
    });

  return false;
}

function voyageCombination(cannibals, missionaries) {
  var combination = [];

  if(cannibals && missionaries) {    

    if(cannibals >= 2) {
      combination.push({cannibals: 2, missionaries: 0});
    }

    if(missionaries >= 2) {
      combination.push({cannibals: 0, missionaries: 2});
    }

    combination.push(
      {cannibals: 1, missionaries: 0},
      {cannibals: 1, missionaries: 1},
      {cannibals: 0, missionaries: 1});

  } else {
    if(cannibals) {
      if(cannibals >= 2) {
        combination.push({cannibals: 2, missionaries: 0});
      }

      combination.push({cannibals: 1, missionaries: 0});
    }

    if(missionaries) {    

      if(missionaries >= 2) {
        combination = [{cannibals: 0, missionaries: 2}];
      }

      combination.push({cannibals: 0, missionaries: 1});
    }
  }

  return combination;
}

function mountChildrenState(leftSideCannibals, leftSideMissionaries, rightSideCannibals, rightSideMissionaries, voyage, parentId) {
  if(voyage.side == 'right') {
    leftSideCannibals = leftSideCannibals - voyage.cannibals;
    leftSideMissionaries = leftSideMissionaries - voyage.missionaries;
    rightSideCannibals = rightSideCannibals + voyage.cannibals;
    rightSideMissionaries = rightSideMissionaries + voyage.missionaries;
  } else {
    leftSideCannibals = leftSideCannibals + voyage.cannibals;
    leftSideMissionaries = leftSideMissionaries + voyage.missionaries;
    rightSideCannibals = rightSideCannibals - voyage.cannibals;
    rightSideMissionaries = rightSideMissionaries - voyage.missionaries;
  }

  var state = {
    leftSideCannibals,
    leftSideMissionaries,
    rightSideCannibals,
    rightSideMissionaries,
    parentId,
    id: idCount++,
    voyage
  };

  if(
    (leftSideCannibals > leftSideMissionaries && leftSideMissionaries > 0) || 
    (rightSideCannibals > rightSideMissionaries && rightSideMissionaries > 0) || 
    (rightSideCannibals === 3 && rightSideMissionaries === 3)
  ) {
    state.isPossible = false;
  } else {
    state.isPossible = true;
  }

  return state;
}

function getPath(obj, id) {
  var path = [];
  var finalPath;
  var found = false;

  function search(obj) {
    obj.map(state => {    
      path.push(state.id);
      
      if(state.id === id) {
      	finalPath = path.map(nodes => nodes);
        found = true;
        return false;
      }

      if('children' in state) {
        search(state.children);
        if(found) return false;
      }
		
        if(!found)
      path.pop();
    });
  }

  search(obj);
  return finalPath;
}

function mountSolutionArray(obj, id) {
  var path = [];
  var finalPath;
  var found = false;

  function search(obj) {
    obj.map(state => {    
      path.push(state);
      
      if(state.id === id) {
      	finalPath = path.map(nodes => nodes);
        found = true;
        return false;
      }

      if('children' in state) {
        search(state.children);
        if(found) return false;
      }
		
        if(!found)
      path.pop();
    });
  }

  search(obj);
  return finalPath;
}

var newtree = populateTree(data[0], data);
var solutionArray = mountSolutionArray(newtree, solution);
// console.log(solutionArray)
solutionArray.map(solution => {
  if(solution.voyage.side === 'left') {
    console.log(
    solution.leftSideMissionaries,'M ', solution.leftSideCannibals,'C     <      ',solution.voyage.missionaries,'M ',solution.voyage.cannibals,'C            ',solution.rightSideMissionaries,'M ', solution.rightSideCannibals,'C'
    );
  } else {
    console.log(
    solution.leftSideMissionaries,'M ', solution.leftSideCannibals,'C            ',solution.voyage.missionaries,'M ',solution.voyage.cannibals,'C     >      ',solution.rightSideMissionaries,'M ', solution.rightSideCannibals,'C'
    );
  }
});