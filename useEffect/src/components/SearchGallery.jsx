import { useEffect, useState } from 'react';
import './SearchGallery.css'; // Styles are moved to SearchGallery.css

export default function SearchGallery() {
	const [search, setSearch] = useState('');     // hold user input search value
	const [priority, setPriority] = useState(''); // hold only one dropdown option
	const [post, setPost] = useState([]);

	useEffect(() => {
		fetch("https://fakestoreapi.com/products")
			.then((res) => res.json())
			.then((data) => setPost(data));
	}, []);

	// for filter card by search and priority
	const filteredArr = post.filter(
		(data) => 
			data.title.toLowerCase().includes(search.toLowerCase()) && data.category.toLowerCase().includes(priority.toLowerCase())
	);
	// Ensure category matching works even if priority is empty
	// const filteredArr = post.filter(
	//     (data) =>
	//         data.title.toLowerCase().includes(search.toLowerCase()) &&
	//         (priority === '' || data.category.toLowerCase() === priority.toLowerCase())
	// );
	const handleSearchChange = (event) => {
		setSearch(event.target.value);
	};

	const handlePriorityChange = (event) => {
		setPriority(event.target.value);
	};

	const handleEditCard = (id) => {
		// Prompt the user to enter a new price
		const newPrice = prompt('Enter the new price:');
		// Validate the input
		const parsedPrice = parseFloat(newPrice);

		if (!isNaN(parsedPrice) && parsedPrice > 0) {
			// Update the post state with the new price
			const updatedPosts = post.map((item) => (item.id === id ? { ...item, price: parsedPrice } : item));
			setPost(updatedPosts);
		} else {
			alert('Invalid price. Please enter a valid number greater than 0.');
		}
	};

	const handleDeleteCard = (id) => {
		// Remove item with matching id from the state
		console.log('Delete card with id:', id);
		const updatedPosts = post.filter((item) => item.id !== id);
		setPost(updatedPosts);
	};

	const getRatingClass = (rating) => {
		if (rating >= 4) return 'high';
		if (rating >= 2.5) return 'medium';
		return 'low';
	};

	return (
		<>
			{/* search input container */}
			<div className="searchGallery">
				<b>Search Card Gallery</b>
				<div className="head">
					<input type="text" className="search" value={search} onChange={handleSearchChange} placeholder="Search..." />
					<select name="priority" id="priority" value={priority} onChange={handlePriorityChange}>
						<option value="">Select Priority</option>
						<option value="jewelery">jewelery</option>
						<option value="women's clothing">Women clothing</option>
						<option value="electronics">electronics</option>
					</select>
				</div>
			</div>
			{/* card container */}
			<div className="card-container">
				{filteredArr.map((item) => (
					<div key={item.id} className="card">
						<img src={item.image} alt={item.title} />
						<h2>{item.title}</h2>
						<p>{item.description}</p>
						<p className="price" onClick={() => handleEditCard(item.id)}>
							${item.price}
						</p>
						<p className="category">Category: {item.category}</p>
						<div className={`rating ${getRatingClass(item.rating.rate)}`}>
							<span>Rating: {item.rating.rate}</span>
							<span>({item.rating.count} reviews)</span>
						</div>
						<button className="delete-button" onClick={() => handleDeleteCard(item.id)}>
							&#10006;
						</button>
					</div>
				))}
			</div>
		</>
	);
}

// images
// title
// description
// price
// category
// rating
