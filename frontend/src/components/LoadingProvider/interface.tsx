export default interface ILoadingProvider {
	isLoading: boolean;
	showLoading: () => void;
	hideLoading: () => void;
}