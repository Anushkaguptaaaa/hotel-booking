import React, { useState } from 'react';
import { assets, cities } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';

const HotelReg = () => {
    const { setShowHotelReg, axios, getToken, setIsOwner } = useAppContext();
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        
        try {
            const token = await getToken();
            
            if (!token) {
                toast.error("You need to be logged in to register a hotel");
                setIsLoading(false);
                return;
            }

            const { data } = await axios.post(
                `/api/hotels/`,
                { name, contact, address, city },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        
                    }
                }
            );

            if (data.success) {
                toast.success(data.message);
                setIsOwner(true);
                setShowHotelReg(false);
            } else {
                toast.error(data.message || "Hotel registration failed");
            }
        } catch (error) {
            console.error("Registration error:", error);
            const errorMessage = error.response?.data?.message 
                || error.message 
                || "Failed to register hotel. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div 
            onClick={() => setShowHotelReg(false)} 
            className='fixed top-0 bottom-0 left-0 right-0 z-[100] flex items-center justify-center bg-black/70'
        >
            <form 
                onSubmit={onSubmitHandler} 
                onClick={(e) => e.stopPropagation()} 
                className='flex bg-white rounded-xl max-w-4xl max-md:mx-2'
            >
                <img 
                    src={assets.regImage} 
                    alt="reg-image" 
                    className='w-1/2 rounded-xl hidden md:block'
                />

                <div className='relative flex flex-col items-center md:w-1/2 p-8 md:p-10'>
                    <img 
                        src={assets.closeIcon} 
                        alt="close-icon" 
                        className='absolute top-4 right-4 h-4 w-4 cursor-pointer' 
                        onClick={() => setShowHotelReg(false)}
                    />
                    <p className='text-2xl font-semibold mt-6'>Register Your Hotel</p>

                    {/* Hotel Name */}
                    <div className='w-full mt-4'>
                        <label htmlFor="name" className="font-medium text-gray-500">
                            Hotel Name
                        </label>
                        <input 
                            id='name' 
                            onChange={(e) => setName(e.target.value)} 
                            value={name} 
                            type="text" 
                            placeholder="Type here" 
                            className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light" 
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div className='w-full mt-4'>
                        <label htmlFor="contact" className="font-medium text-gray-500">
                            Phone
                        </label>
                        <input 
                            id='contact' 
                            onChange={(e) => setContact(e.target.value)} 
                            value={contact} 
                            type="tel" 
                            placeholder="Type here" 
                            className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light" 
                            required
                        />
                    </div>

                    {/* Address */}
                    <div className='w-full mt-4'>
                        <label htmlFor="address" className="font-medium text-gray-500">
                            Address
                        </label>
                        <input 
                            id='address' 
                            onChange={(e) => setAddress(e.target.value)} 
                            value={address} 
                            type="text" 
                            placeholder="Type here" 
                            className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light" 
                            required
                        />
                    </div>

                    {/* Select City Drop Down */}
                    <div className='w-full mt-4 max-w-60 mr-auto'>
                        <label htmlFor="city" className="font-medium text-gray-500">City</label>
                        <select 
                            id="city" 
                            onChange={(e) => setCity(e.target.value)} 
                            value={city} 
                            className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light" 
                            required
                        >
                            <option value="">Select City</option>
                            {cities.map((cityItem) => (
                                <option key={cityItem} value={cityItem}>{cityItem}</option>
                            ))}
                        </select>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`bg-indigo-500 hover:bg-indigo-600 transition-all text-white mr-auto px-6 py-2 rounded cursor-pointer mt-6 ${
                            isLoading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default HotelReg;