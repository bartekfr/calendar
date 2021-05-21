// https://stackoverflow.com/a/6860916
export function guidGenerator () {
  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) // tslint:disable-line
  }
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}

export const exhaustiveCheck = ( param: never ): never => {
  throw new Error( `Unreachable case: ${param}`)
}