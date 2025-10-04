import { useEffect, useState } from "react";
import { useLocation } from "../shared/LocationProvider";
import { Button, Form, Modal } from "react-bootstrap";
import { processFormDataChangeEvent } from "../helpers/Forms";
import { CountrySelect } from "../shared/CountrySelect";
import { LocationRefreshStatus } from "../shared/enums/Enums";
import "../css/LocationSlider.css";
import { useWeather } from "../shared/WeatherProvider";


export const LocationSlider = () => {
    interface ILocationForm {
        city?: string;
        state?: string;
        postal?: string;
        countryCode?: string;
    }

    const { refreshWeather, currentWeather } = useWeather();
    const { currentLocation, refreshCurrentLocationManually, refreshCurrentLocation } = useLocation();
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const [formData, setFormData] = useState<ILocationForm>({
        city: '',
        state: '',
        postal: '',
        countryCode: 'us'
    });

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        processFormDataChangeEvent<ILocationForm>(event, formData, setFormData);
    };

    const handleSearch = async (event: React.FormEvent) => {
        event.preventDefault();

        const response = await refreshCurrentLocationManually(formData.countryCode!, formData.city, formData.state, formData.postal);
        if (response.status === LocationRefreshStatus.NotFound) {
            alert("Location not found. Please try again.");
        } else if (response.status === LocationRefreshStatus.Success && response.location) {
            await refreshWeather(response.location.lat, response.location.lon);
            setShowModal(false);
            setFormData({ city: '', state: '', postal: '', countryCode: 'us' });
        }
    };

    const handleGetCurrentLocation = async () => {
        const response = await refreshCurrentLocation();
        if (response.status === LocationRefreshStatus.Error) {
            alert("Error fetching current location. Please try again.");
        } else if (response.status === LocationRefreshStatus.Success && response.location) {
            await refreshWeather(response.location.lat, response.location.lon);
            setShowModal(false);
        }
    }

    useEffect(() => {
        const fetchLocation = async () => {
            const response = await refreshCurrentLocation();
            if (response.status === LocationRefreshStatus.Error) {
                setShowModal(true);
            } else if (response.status === LocationRefreshStatus.Success && response.location) {
                await refreshWeather(response.location.lat, response.location.lon);
            }
        }

        fetchLocation();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            {currentLocation && (
                <div id="top-location-container">
                    <div id="top-location-left">
                        <p>{currentLocation.location}, {currentLocation.state}</p>
                        <Button variant='outline-info' size="sm" onClick={() => setShowModal(true)}>
                            Change Location
                            <i className="fa fa-icon fa-search" style={{ marginLeft: '5px' }}></i>
                        </Button>
                    </div>
                    <div id="top-location-right">
                        <p>
                            {currentWeather?.currentCondition.temperature.toFixedNumber(0)} °F
                            <br />
                            {currentWeather?.currentCondition.description.toPascalCase()}

                        </p>
                    </div>
                </div>
            )}
            {showModal && (
                <Modal
                    show={showModal}
                    onHide={handleClose}
                    backdrop={currentLocation === null ? "static" : undefined}
                    keyboard={false}
                    className='location-modal'
                    size="lg"
                    centered
                >
                    <Modal.Header closeButton={currentLocation !== null}>
                        <Modal.Title>Change Location</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSearch}>
                            <div className="mb-4">
                                <Button 
                                    onClick={handleGetCurrentLocation} 
                                    variant='outline-info' 
                                    size="sm" 
                                    className='w-100' 
                                    type="button"
                                >
                                    <i className="fa fa-map-marker" style={{ marginRight: '8px' }}></i>
                                    Get Current Location
                                </Button>
                            </div>

                            <div className="text-center mb-3 separator">
                                <span>OR</span>
                            </div>

                            

                            <Form.Group className="mb-4 country-section" controlId="countryCode">
                                <Form.Label>Country <span className="text-danger">*</span> <small>(required for all searches below)</small></Form.Label>
                                <CountrySelect value={formData.countryCode!} onChange={(value) => setFormData({ ...formData, countryCode: value })} />
                            </Form.Group>

                            <div className="search-options-container">
                                <div className="search-option">
                                    <h6 className="mb-2">Search by Postal Code:</h6>
                                    <Form.Group controlId="postal">
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Enter postal code" 
                                            name="postal" 
                                            value={formData.postal} 
                                            onChange={handleFormChange} 
                                        />
                                    </Form.Group>
                                </div>

                                <div className="text-center my-3 separator">
                                    <span>OR</span>
                                </div>

                                <div className="search-option">
                                    <h6 className="mb-2">Search by City & State:</h6>
                                    <Form.Group className="mb-3" controlId="city">
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Enter city name" 
                                            name="city" 
                                            value={formData.city} 
                                            onChange={handleFormChange} 
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="state">
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Enter 2 letter state code (if applicable)" 
                                            name="state" 
                                            value={formData.state} 
                                            onChange={handleFormChange} 
                                        />
                                    </Form.Group>
                                </div>
                            </div>

                            <Button variant='outline-info' size="sm" className='w-100' type="submit">
                                <i className="fa fa-search" style={{ marginRight: '8px' }}></i>
                                Search
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
}