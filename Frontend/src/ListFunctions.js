import axios from 'axios'

export const getHotelList = () => {
    var data
    const instance = axios.create({baseURL: 'http://localhost:5000'})
    return instance.get(
        '/userPanel/hotelsList',
        {
            headers: { 'Content-type': 'application/json' }
        } 
    ).then(response =>{
        data = response.data
        console.log(response.data)
        return data
    });
}
export const getRoomTypeChart = () => {
    var data
    const instance = axios.create({baseURL: 'http://localhost:5000'})
    return instance.get(
        '/userPanel/dashboard',
        {
            headers: { 'Content-type': 'application/json' }
        } 
    ).then(response =>{
        data = response.data
        console.log(response.data)
        return data
    });
}
export const getNeighbourhood = () => {
    var data
    const instance = axios.create({baseURL: 'http://localhost:5000'})
    return instance.get(
        '/userPanel/dashboard/neighbourhood',
        {
            headers: { 'Content-type': 'application/json' }
        } 
    ).then(response =>{
        data = response.data
        console.log(response.data)
        return data
    });
}
export const addWaitingToReview = (userid,hotelid,pictureurl,name) =>{
    const instance = axios.create({baseURL: 'http://localhost:5000'})
    return instance.post(
        '/userPanel/hotelsList',
        {
            reviewer_id: userid,
            hotel_id: hotelid,
            picture_url:pictureurl,
            name: name
        },
        {
            headers: { 'Content-type': 'application/json' }
        }         
    )
    .then((response) => {
        console.log(response.status)
            var resp = response.status
            return resp
    })
}  
export const addReview = (userid,hotelid,review) =>{
    const instance = axios.create({baseURL: 'http://localhost:5000'})
    return instance.post(
        '/userPanel/waitingToReview',
        {
            reviewer_id: userid,
            hotel_id: hotelid,
            review: review
        },
        {
            headers: { 'Content-type': 'application/json' }
        }         
    )
    .then((response) => {
        console.log(response.status)
            var resp = response.status
            return resp
    })
}
export const ALSRecommendation = () => {
    const instance = axios.create({baseURL: 'http://localhost:5000'})
    return instance.post(
        '/userPanel/waitingToReview/ALS',
        {
            headers: { 'Content-type': 'application/json' }
        } 
    ).then((response) => {
        console.log(response.status)
            var resp = response.status
            return resp
    });
}
export const SVDRecommendation = () => {
    const instance = axios.create({baseURL: 'http://localhost:5000'})
    return instance.post(
        '/userPanel/waitingToReview/SVD',
        {
            headers: { 'Content-type': 'application/json' }
        } 
    ).then((response) => {
        console.log(response.status)
            var resp = response.status
            return resp
    });
}      
export const deleteReview = (userid,hotelid) => {
    const instance = axios.create({baseURL: 'http://localhost:5000'})
    return instance.delete(
        `/userPanel/waitingToReview/${userid}/${hotelid}`,
        {
            headers: { 'Content-type': 'application/json' }
        } 
    ).then((response) => {
        console.log(response.status)
            var resp = response.status
            return resp
    });
}
export const getRecentlyVisited = (id) => {
    var data
    const instance = axios.create({baseURL: 'http://localhost:5000'})
    return instance.get(
        `/userPanel/${id}`,
        {
            headers: { 'Content-type': 'application/json' }
        } 
    ).then(response =>{
        data = response.data
        console.log(response.data)
        return data
    });
}
export const getWaitingToReview = (id) => {
    var data
    const instance = axios.create({baseURL: 'http://localhost:5000'})
    return instance.get(
        `/userPanel/waitingToReview/${id}`,
        {
            headers: { 'Content-type': 'application/json' }
        } 
    ).then(response =>{
        data = response.data
        console.log(response.data)
        return data
    });
}
export const getRecommendationSVD = (id) => {
    var data
    const instance = axios.create({baseURL: 'http://localhost:5000'})
    return instance.get(
        `/userPanel/recommendation/${id}`,
        {
            headers: { 'Content-type': 'application/json' }
        } 
    ).then(response =>{
        data = response.data
        console.log(response.data)
        return data
    });
}
export const getRecommendationALS = (id) => {
    var data
    const instance = axios.create({baseURL: 'http://localhost:5000'})
    return instance.get(
        `/userPanel/recommendation/ALS/${id}`,
        {
            headers: { 'Content-type': 'application/json' }
        } 
    ).then(response =>{
        data = response.data
        console.log(response.data)
        return data
    });
}
