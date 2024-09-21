
import React, { useEffect, useMemo, useState } from 'react';
import './SearchGallery.css'; // Assuming the styles are in SearchGallery.css

export default function SearchGallery() {
	const [search, setSearch] = useState('');
	const [priority, setPriority] = useState('');
	const [post, setPost] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	function getRatingClass(rating) {
		if (rating >= 4) return 'high';
		if (rating >= 2.5) return 'medium';
		return 'low';
	}

	function getPriceClass(price) {
		if (price > 100) return 'high-price';
		if (price > 50) return 'medium-price';
		return 'low-price';
	}

	useEffect(() => {
		fetch("https://fakestoreapi.com/products")
			.then((res) => {
				if (!res.ok) {
					throw new Error('Network response was not ok');
				}
				return res.json();
			})
			.then((data) => {
				setPost(data);
				setLoading(false);
			})
			.catch((error) => {
				setError(error.message);
				setLoading(false);
			});
	}, []);

	useEffect(() => {
		console.log('Search:', search);
		console.log('Priority:', priority);
	}, [search, priority]);

	const filteredArr = useMemo(() => {
		return post.filter((data) => {
			const matchesSearch = data.title.toLowerCase().includes(search.toLowerCase());
			const ratingClass = getRatingClass(data.rating.rate);
			const matchesPriority = priority === '' || ratingClass === priority;

			return matchesSearch && matchesPriority;
		});
	}, [search, priority, post]);

	const handleSearchChange = (event) => {
		setSearch(event.target.value);
	};

	const handlePriorityChange = (event) => {
		setPriority(event.target.value);
	};

	const handleEditCard = (id) => {
		console.log('Edit card with id:', id);
	};

	const handleDeleteCard = (id) => {
		const updatedPosts = post.filter((item) => item.id !== id);
		setPost(updatedPosts);
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className="searchGallery">
			<h1>Search Gallery</h1>
			<div className="head">
				<input type="text" className="search" value={search} onChange={handleSearchChange} placeholder="Search..." />
				<select name="priority" id="priority" value={priority} onChange={handlePriorityChange}>
					<option value="">Select Priority</option>
					<option value="high">High</option>
					<option value="medium">Medium</option>
					<option value="low">Low</option>
				</select>
			</div>
			<div className="card-container">
				{filteredArr.length === 0 ? (
					<p>No cards found</p>
				) : (
					filteredArr.map((item) => (
						<Card
							key={item.id}
							item={item}
							onEdit={handleEditCard}
							onDelete={handleDeleteCard}
							getRatingClass={getRatingClass}
							getPriceClass={getPriceClass}
						/>
					))
				)}
			</div>
		</div>
	);
}

function Card({ item, onEdit, onDelete, getRatingClass, getPriceClass }) {
	return (
		<div className="card">
			<img src={item.image} alt={item.title} />
			<h2>{item.title}</h2>
			<p>{item.description}</p>
			<p className={`price ${getPriceClass(item.price)}`} onClick={() => onEdit(item.id)}>
				${item.price}
			</p>
			<p className="category">Category: {item.category}</p>
			<div className={`rating ${getRatingClass(item.rating.rate)}`}>
				<span>Rating: {item.rating.rate}</span>
				<span>({item.rating.count} reviews)</span>
			</div>
			<button className="delete-button" onClick={() => onDelete(item.id)}>
				&#10006;
			</button>
		</div>
	);
}
