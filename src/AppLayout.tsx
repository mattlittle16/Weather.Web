import { LocationSlider } from "./components/LocationSlider";
import { useBackground } from "./hooks/useBackground";

export interface AppLayoutProps {
    Component: React.FC;
}

const AppLayout = ({ Component }: AppLayoutProps) => {
    // Hook applies background directly to body element
    useBackground();

    return (
        <>
            <LocationSlider />
            <Component />
        </>
    );
};

export default AppLayout;