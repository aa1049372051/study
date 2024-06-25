/**
 * 参数类型取反
 * @param x 参数是除字符串以为的所有类型
 */
function m<T>(x: T extends string ? never : T) {
    console.log(x)
}
m(1)
m('22')

//vue+ts+nut-ui
// import { ref } from "vue";
// export function useCompRef<T extends abstract new (...args: any) => any>(_comp: T) {
//     return ref<InstanceType<T>>();
// }

// import { Form } from "@nutui/nutui-taro";
// const payDialogRef = useCompRef(Form);
// payDialogRef.value?.validate


// infer 关键字，我们可以在类型系统中进行类型的自动推断，从而实现更加灵活和可复用的类型定义。
//类型工具 返回函数的返回值类型
type Return<T> = T extends (...args: any[]) => infer R ? R : T
type sum = (a: number, b: number) => number

let sumResult: Return<sum>

//返回第一个参数的类型
type FirstArg<T> = T extends (x: infer F, ...args: any) => any ? F : T

type fa = FirstArg<(name: string, age: number) => void>