import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext';
import Title from './Title';
import HotelCard from './HotelCard';

const RecommendedHotels = () => {

    const { rooms, searchedCities } = useAppContext();

    const [recommended, setRecommended] = useState([]);

    const filterHotels = () => {
        let filteredHotels;
        
        if (searchedCities.length > 0) {
            // Show hotels from searched cities if available
            filteredHotels = rooms.slice().filter(room => searchedCities.includes(room.hotel.city));
        }
        
        // If no searched cities or no hotels found from searched cities, show random hotels
        if (!filteredHotels || filteredHotels.length === 0) {
            filteredHotels = rooms.slice().sort(() => Math.random() - 0.5);
        }
        
        setRecommended(filteredHotels);
    }

    useEffect(() => {
        filterHotels()
    }, [rooms, searchedCities])

    return rooms.length > 0 && (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
            <Title title="Recommended Hotels" subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences." />
            <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
                {recommended.slice(0, 4).map((room, index) => (
                    <HotelCard key={room._id} room={room} index={index} />
                ))}
            </div>
        </div>
    )
}

export default RecommendedHotels