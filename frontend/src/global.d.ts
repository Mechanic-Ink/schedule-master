// declare module "*.scss" {
//   const styles: { [className: string]: string };
//   export default styles;
// }

declare module "*.scss" {
	const content: { [className: string]: string };
	export = content;
}

// declare module "*.scss" {
// 	const classes: { [key: string]: string };
// 	export default classes;
// }
