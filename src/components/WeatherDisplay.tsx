import { Tab, Tabs, Row, Col, Card } from "react-bootstrap";
import { useWeather } from "../shared/WeatherProvider";
import { useEffect, useState } from "react";
import "../css/WeatherDisplay.css";

export const WeatherDisplay = () => {
    const { currentWeather, lastUpdated } = useWeather();
    const [timeAgo, setTimeAgo] = useState<string>('');

    // Update "time ago" every second
    useEffect(() => {
        if (!lastUpdated) {
            setTimeAgo('');
            return;
        }

        const updateTimeAgo = () => {
            const now = new Date();
            const diffMs = now.getTime() - lastUpdated.getTime();
            const diffSeconds = Math.floor(diffMs / 1000);
            const diffMinutes = Math.floor(diffSeconds / 60);
            const diffHours = Math.floor(diffMinutes / 60);

            if (diffSeconds < 60) {
                setTimeAgo('just now');
            } else if (diffMinutes < 60) {
                setTimeAgo(`${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`);
            } else {
                setTimeAgo(`${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`);
            }
        };

        updateTimeAgo();
        const intervalId = setInterval(updateTimeAgo, 1000);

        return () => clearInterval(intervalId);
    }, [lastUpdated]);

    if (!currentWeather) {
        return null;
    }

    // Format time from ISO string to readable format
    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    // Format date from ISO string
    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    // Format day of week
    const formatDayOfWeek = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    };

    return (
        <div className="weather-display-container">
            <div className="weather-display-card">
                {lastUpdated && (
                    <div className="last-updated">
                        Last updated: {timeAgo}
                    </div>
                )}
                <Tabs
                    defaultActiveKey="current"
                    id="weather-tabs"
                    className="mb-3"
                    fill
                >
                    {/* Current Weather Tab */}
                    <Tab eventKey="current" title="Current">
                        <div className="current-weather-content">
                            <Row className="mb-4">
                                <Col md={6} className="text-center">
                                    <div className="current-temp-display">
                                        <h1 className="display-1">{currentWeather.currentCondition.temperature.toFixedNumber(0)}°F</h1>
                                        <p className="lead">{currentWeather.currentCondition.description.toPascalCase()}</p>
                                        <p className="text-muted">Feels like {currentWeather.currentCondition.feelsLike.toFixedNumber(0)}°F</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <Card className="weather-details-card">
                                        <Card.Body>
                                            <Row className="mb-2">
                                                <Col xs={7} className="text-start">
                                                    <i className="fa fa-tint" aria-hidden="true"></i> Humidity
                                                </Col>
                                                <Col xs={5} className="text-start">
                                                    <strong>{currentWeather.currentCondition.humidity}%</strong>
                                                </Col>
                                            </Row>
                                            <Row className="mb-2">
                                                <Col xs={7} className="text-start">
                                                    <i className="fa fa-flag" aria-hidden="true"></i> Wind Speed
                                                </Col>
                                                <Col xs={5} className="text-start">
                                                    <strong>{currentWeather.currentCondition.windSpeed.toFixedNumber(1)} mph</strong>
                                                </Col>
                                            </Row>
                                            <Row className="mb-2">
                                                <Col xs={7} className="text-start">
                                                    <i className="fa fa-tachometer" aria-hidden="true"></i> Pressure
                                                </Col>
                                                <Col xs={5} className="text-start">
                                                    <strong>{currentWeather.currentCondition.pressure} hPa</strong>
                                                </Col>
                                            </Row>
                                            <Row className="mb-2">
                                                <Col xs={7} className="text-start">
                                                    <i className="fa fa-sun-o" aria-hidden="true"></i> UV Index
                                                </Col>
                                                <Col xs={5} className="text-start">
                                                    <strong>{currentWeather.currentCondition.uvIndex.toFixedNumber(1)}</strong>
                                                </Col>
                                            </Row>
                                            <Row className="mb-2">
                                                <Col xs={7} className="text-start">
                                                    <i className="fa fa-cloud" aria-hidden="true"></i> Cloud Cover
                                                </Col>
                                                <Col xs={5} className="text-start">
                                                    <strong>{currentWeather.currentCondition.cloudPercentage}%</strong>
                                                </Col>
                                            </Row>
                                            {currentWeather.currentCondition.windGusts > 0 && (
                                                <Row className="mb-2">
                                                    <Col xs={7} className="text-start">
                                                        <i className="fa fa-flag" aria-hidden="true"></i> Wind Gusts
                                                    </Col>
                                                    <Col xs={5} className="text-start">
                                                        <strong>{currentWeather.currentCondition.windGusts.toFixedNumber(1)} mph</strong>
                                                    </Col>
                                                </Row>
                                            )}
                                            <Row className="mb-2">
                                                <Col xs={7} className="text-start">
                                                    <i className="fa fa-sun-o" aria-hidden="true" style={{ color: '#FFD700' }}></i> Sunrise
                                                </Col>
                                                <Col xs={5} className="text-start">
                                                    <strong>{formatTime(currentWeather.dailyConditions[0].sunrise)}</strong>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={7} className="text-start">
                                                    <i className="fa fa-moon-o" aria-hidden="true" style={{ color: '#FFA500' }}></i> Sunset
                                                </Col>
                                                <Col xs={5} className="text-start">
                                                    <strong>{formatTime(currentWeather.dailyConditions[0].sunset)}</strong>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Tab>

                    {/* Hourly Weather Tab */}
                    <Tab eventKey="hourly" title="Hourly">
                        <div className="hourly-weather-content">
                            <Row>
                                {currentWeather.hourlyConditions.slice(0, 24).map((hour, index) => (
                                    <Col key={index} xs={12} className="mb-3">
                                        <Card className="hourly-card">
                                            <Card.Body>
                                                <Row className="align-items-center">
                                                    <Col xs={6} md={2}>
                                                        <strong>{formatTime(hour.time)}</strong>
                                                    </Col>
                                                    <Col xs={6} md={2} className="text-center">
                                                        <div className="hourly-temp">{hour.temperature.toFixedNumber(0)}°F</div>
                                                        <small className="text-muted">Feels {hour.feelsLike.toFixedNumber(0)}°F</small>
                                                    </Col>
                                                    <Col xs={6} md={3} className="text-center">
                                                        <div>{hour.description.toPascalCase()}</div>
                                                    </Col>
                                                    <Col xs={6} md={2} className="text-center">
                                                        <small>
                                                            <i className="fa fa-flag"></i> {hour.windSpeed.toFixedNumber(0)} mph
                                                        </small>
                                                        <br />
                                                        <small>
                                                            <i className="fa fa-tint"></i> {hour.humidity}%
                                                        </small>
                                                    </Col>
                                                    <Col xs={6} md={2} className="text-center">
                                                        <small>
                                                            <i className="fa fa-cloud"></i> {hour.cloudPercentage}%
                                                        </small>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </Tab>

                    {/* Daily Weather Tab */}
                    <Tab eventKey="daily" title="Daily">
                        <div className="daily-weather-content">
                            <Row>
                                {currentWeather.dailyConditions.map((day, index) => (
                                    <Col key={index} xs={12} className="mb-3">
                                        <Card className="daily-card">
                                            <Card.Body>
                                                <Row className="align-items-center">
                                                    <Col xs={12} md={3}>
                                                        <strong>{index === 0 ? 'Today' : formatDayOfWeek(day.time)}</strong>
                                                        <br />
                                                        <small className="text-muted">{formatDate(day.time)}</small>
                                                    </Col>
                                                    <Col xs={6} md={3} className="text-center">
                                                        <div>{day.description.toPascalCase()}</div>
                                                    </Col>
                                                    <Col xs={6} md={2} className="text-center">
                                                        <div>
                                                            <i className="fa fa-arrow-up text-danger"></i> {day.temp.max.toFixedNumber(0)}°F
                                                        </div>
                                                        <div>
                                                            <i className="fa fa-arrow-down text-primary"></i> {day.temp.min.toFixedNumber(0)}°F
                                                        </div>
                                                    </Col>
                                                    <Col xs={6} md={2} className="text-center">
                                                        <small>
                                                            <i className="fa fa-flag"></i> {day.windSpeed.toFixedNumber(0)} mph
                                                        </small>
                                                        <br />
                                                        <small>
                                                            <i className="fa fa-tint"></i> {day.humidity}%
                                                        </small>
                                                    </Col>
                                                    <Col xs={6} md={2} className="text-center">
                                                        <small>
                                                            <i className="fa fa-sun-o"></i> UV {day.uvIndex.toFixedNumber(1)}
                                                        </small>
                                                    </Col>
                                                </Row>
                                                <Row className="mt-2">
                                                    <Col xs={6} className="text-center">
                                                        <small>
                                                            <i className="fa fa-sun-o" style={{ color: '#FFD700' }}></i> {formatTime(day.sunrise)}
                                                        </small>
                                                    </Col>
                                                    <Col xs={6} className="text-center">
                                                        <small>
                                                            <i className="fa fa-moon-o" style={{ color: '#FFA500' }}></i> {formatTime(day.sunset)}
                                                        </small>
                                                    </Col>
                                                </Row>
                                                {day.summary && (
                                                    <Row className="mt-2">
                                                        <Col>
                                                            <small className="text-muted">{day.summary}</small>
                                                        </Col>
                                                    </Row>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
};
