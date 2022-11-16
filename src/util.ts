// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Util {
  static removeDuplicates<T>(array: T[]): T[] {
    return array.filter((value, index) => array.indexOf(value) === index);
  }

  // static sortByNumberOfOccurrences<T extends object>(
  //   array: T[],
  //   key: keyof T,
  //   key2?: keyof typeof key
  // ): T[keyof T][] {
  //   return key2 === undefined
  //     ? [...new Set(array.map(item => item[key]))]
  //     : [...new Set(array.map(item => item[key][key2]))];
  // }
}
