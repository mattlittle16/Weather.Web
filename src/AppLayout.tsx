import { LocationSlider } from "./components/LocationSlider";

export interface AppLayoutProps {
    Component: React.FC;
}

const AppLayout = ({ Component }: AppLayoutProps) => {
    return (
        <>
            <LocationSlider />
            <Component />
        </>
    );
};

export default AppLayout;