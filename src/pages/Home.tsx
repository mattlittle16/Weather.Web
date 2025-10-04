import { WeatherDisplay } from "../components/WeatherDisplay";
import { useWeather } from "../shared/WeatherProvider";


const Home = () => {

    const { currentWeather } = useWeather();

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '100px' }}>
            {currentWeather && <WeatherDisplay />}
        </div>
    );
}

export default Home;