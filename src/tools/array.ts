export function indexWhere(arr, val, fieldName?) {
  if (!fieldName) {
    return arr.indexOf(val);
  }

  const isValObj = typeof val === 'object';
  let index = -1;

  arr.some((d, i) => {
    const dVal = isValObj ? val?.[fieldName] : val;

    if (d?.[fieldName] === dVal) {
      index = i;
      return true;
    }
    return false;
  });

  return index;
}

export function sliceWhere([...arr], val, fieldName?) {
  spliceWhere(arr, val, fieldName);
  return arr;
}

export function spliceWhere(arr, val, fieldName?) {
  const index = indexWhere(arr, val, fieldName);

  if (index > -1) arr.splice(index, 1);
}

function _addUniq({ arr, val, fieldName }, action) {
  if (Array.isArray(val)) {
    val.forEach(v => addUniq(arr, v, fieldName));
    return;
  }

  const index = indexWhere(arr, val, fieldName);

  if (index === -1) action(val);
}

export function addUniq(arr, val: any | any[], fieldName?) {
  _addUniq({ arr, val, fieldName }, value => arr.push(value));
}

export function unshiftUniq(arr, val, fieldName) {
  _addUniq({ arr, val, fieldName }, value => arr.unshift(value));
}

export function sortByField(arr, fieldName, f = str => str) {
  return arr.sort((a, b) =>
    f(a[fieldName]) > f(b[fieldName])
      ? 1
      : f(b[fieldName]) > f(a[fieldName])
      ? -1
      : 0
  );
}

export function groupByField(arr, fieldName) {
  return arr.reduce((acc, item) => {
    const field = item[fieldName];
    if (!acc[field]) acc[field] = [];
    acc[field].push(item);
    return acc;
  }, {});
}

export function getIndexCircular(arr: any[], index: number) {
  const l = arr.length;
  return arr[((index % l) + l) % l];
}

export function circularSlice(arr: any[], startIndex: number, count: number) {
  const newArr = [];

  for (let i = 0; i < count; i++) {
    newArr.push(getIndexCircular(arr, startIndex + i));
  }

  return newArr;
}
