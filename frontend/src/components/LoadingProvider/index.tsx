import { createContext, useContext, useState } from 'react';
import ILoadingProvider from './interface';

const LoadingContext = createContext<ILoadingProvider>({
	isLoading: false,
	showLoading: () => {},
	hideLoading: () => {},
});

export const useLoading = () => {
	return useContext(LoadingContext);
};

const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [isLoading, setIsLoading] = useState(false);

	const showLoading = () => {
		setIsLoading(true);
	};

	const hideLoading = () => {
		setIsLoading(false);
	};

	return (
		<LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
			{children}
		</LoadingContext.Provider>
	);
};

export default LoadingProvider;