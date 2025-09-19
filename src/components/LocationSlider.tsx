import { useEffect, useState } from "react";
import { useLocation } from "../shared/LocationProvider";
import { Button, Form, Modal } from "react-bootstrap";
import { processFormDataChangeEvent } from "../helpers/Forms";
import { geoCode } from "../loaders/ApiLoader";
import type { ILocation } from "../models/LocationModel";


export const LocationSlider = () => {
    interface ILocationForm {
        city?: string;
        state?: string;
        postal?: string;
    }

    const { currentLocation, setCurrentLocation } = useLocation();
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const [formData, setFormData] = useState<ILocationForm>({
        city: '',
        state: '',
        postal: ''
    });

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        processFormDataChangeEvent<ILocationForm>(event, formData, setFormData);        
    };

    const handleSearch = async (event: React.FormEvent) => {
        event.preventDefault();
        
        try {
            const location = await geoCode(formData.city!, formData.state!, formData.postal!);
            if (location) {
                    setCurrentLocation({
                        lat: location.latitude,
                        lon: location.longitude,
                        city: location.name,
                        state: location.state,
                        postalCode: formData.postal,
                        country: location.country,
                    } as ILocation);
                    handleClose();
                } else {
                    alert("Location not found. Please try again.");
                }
        } catch (error) {
            console.error("Error occurred while searching for location:", error);
        }
    };

    useEffect(() => {            
        if (navigator.geolocation && true===false) {          
            navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                setCurrentLocation({
                    lat: latitude,
                    lon: longitude
                });
            },
            (error) => {
                console.error("Error obtaining location:", error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 10000
            });
        } else {            
            setShowModal(true);
        };            
                
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            Location Slider Component
            {currentLocation && (
                <div>
                    <p>Latitude: {currentLocation.lat}</p>
                    <p>Longitude: {currentLocation.lon}</p>
                </div>
            )}
            {showModal && (
                <Modal
                    show={showModal}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    className='white-container'
                >                    
                    <Modal.Body>
                    <Form onSubmit={handleSearch}>
                        <h4 className='ctext-center'>Please allow location services or search below</h4>
                        <Form.Group className="mb-3" controlId="city">                            
                            <Form.Control type="text" placeholder="Enter a city name" required name="city" value={formData.city} onChange={handleFormChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="state">                            
                            <Form.Control type="text" placeholder="Enter a state name" required name="state" value={formData.state} onChange={handleFormChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="postal">                            
                            <Form.Control type="text" placeholder="Enter a postal code" required name="postal" value={formData.postal} onChange={handleFormChange} />
                        </Form.Group>
                        <Button variant='outline-info' size="sm" className='cfull-width' type="submit">Search</Button>                    
                    </Form>
                    </Modal.Body>                    
                </Modal>
            )}
        </div>
    );
}