/* ============================================================
   排序算法集合
   包含三种经典排序算法：
     1. 冒泡排序（Bubble Sort）
     2. 快速排序（Quick Sort）
     3. 归并排序（Merge Sort）

   运行方式：
     node js/sorting.js      —— 直接在命令行运行，输出演示与正确性校验
   ============================================================ */

/**
 * 冒泡排序
 * 思路：相邻元素两两比较，把较大的元素逐步「冒泡」到数组末尾。
 * 时间复杂度：O(n²)，稳定排序，原地排序。
 */
function bubbleSort(arr) {
  const a = arr.slice(); // 复制一份，不修改原数组
  const n = a.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false; // 本轮是否发生过交换
    for (let j = 0; j < n - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    // 若一轮下来没有交换，说明已经有序，提前结束
    if (!swapped) break;
  }
  return a;
}

/**
 * 快速排序
 * 思路：选一个基准值（pivot），把小于它的放左边、大于它的放右边，
 *       再对左右两部分递归执行同样操作。
 * 时间复杂度：平均 O(n log n)，最坏 O(n²)；原地排序，不稳定。
 */
function quickSort(arr) {
  const a = arr.slice();

  // 对 a[lo..hi] 进行分区，返回基准值的最终位置
  function partition(lo, hi) {
    // 三数取中（median-of-three），避免已排序/大量重复数据退化为 O(n²)
    const mid = (lo + hi) >> 1;
    if (a[lo] > a[mid]) [a[lo], a[mid]] = [a[mid], a[lo]];
    if (a[lo] > a[hi]) [a[lo], a[hi]] = [a[hi], a[lo]];
    if (a[mid] > a[hi]) [a[mid], a[hi]] = [a[hi], a[mid]];
    const pivot = a[hi];
    let i = lo; // i 指向「小于 pivot 区域」的下一个位置
    for (let j = lo; j < hi; j++) {
      if (a[j] < pivot) {
        [a[i], a[j]] = [a[j], a[i]];
        i++;
      }
    }
    // 把基准值放到正确位置
    [a[i], a[hi]] = [a[hi], a[i]];
    return i;
  }

  function sort(lo, hi) {
    if (lo >= hi) return;
    const p = partition(lo, hi);
    sort(lo, p - 1);
    sort(p + 1, hi);
  }

  sort(0, a.length - 1);
  return a;
}

/**
 * 归并排序
 * 思路：分治法。不断把数组从中间一分为二，直到每个子数组只剩一个元素，
 *       再两两合并成有序数组。
 * 时间复杂度：O(n log n)，稳定排序，需要额外空间。
 */
function mergeSort(arr) {
  const a = arr.slice();
  if (a.length <= 1) return a;

  const mid = Math.floor(a.length / 2);
  const left = mergeSort(a.slice(0, mid));
  const right = mergeSort(a.slice(mid));

  return merge(left, right);
}

// 合并两个有序数组
function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  // 把剩余部分直接拼上
  return result.concat(left.slice(i)).concat(right.slice(j));
}

/* ============================================================
   演示与正确性校验（仅在 Node 环境执行）
   ============================================================ */

function demo() {
  const data = Array.from({ length: 20 }, () =>
    Math.floor(Math.random() * 100)
  );
  // 以 JS 内置排序结果作为「标准答案」
  const expected = [...data].sort((x, y) => x - y);

  const algorithms = [
    { name: "冒泡排序", fn: bubbleSort },
    { name: "快速排序", fn: quickSort },
    { name: "归并排序", fn: mergeSort },
  ];

  console.log("原始数组：", data);
  console.log("标准答案：", expected);
  console.log("-----------------------------");

  let allPass = true;
  for (const { name, fn } of algorithms) {
    const sorted = fn(data);
    const ok = JSON.stringify(sorted) === JSON.stringify(expected);
    if (!ok) allPass = false;
    console.log(`${name}：${sorted}`);
    console.log(`  正确性：${ok ? "✅ 通过" : "❌ 失败"}`);
  }
  console.log("-----------------------------");
  console.log(allPass ? "全部算法校验通过 🎉" : "存在校验失败的算法 ⚠️");
}

// 在 Node 环境中运行时执行演示
if (typeof window === "undefined") {
  demo();
}

// 支持在 Node 中作为模块引入
if (typeof module !== "undefined" && module.exports) {
  module.exports = { bubbleSort, quickSort, mergeSort };
}
