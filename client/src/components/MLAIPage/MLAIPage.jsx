import React from "react";
import publications from "../../research_publications.json";
import SIGPublicationCard from "../../pages/SIGs/SIGPublicationCard.jsx";
import "./MLAIPage.scss";
import NeuralCanvas from "./NeuralCanvas.jsx";

export default function MLAIPage({ onBack, showBack = false }) {
	const data = publications.find((d) => d.domain.toLowerCase() === "machine learning and ai");

	return (
		<section className="mlai">
					<div className="mlai__hero">
						{showBack && (
							<button className="mlai__back" onClick={onBack} aria-label="Back to SIGs">← SIGs</button>
						)}
					<NeuralCanvas className="mlai__canvas" />
					<div className="mlai__grid-bg" aria-hidden="true" />
						<div className="mlai__fade" aria-hidden="true" />
				<div className="mlai__content container">
					<h1 className="mlai__title">Machine Learning & AI</h1>
					<p className="mlai__subtitle">Models, data, and systems powering intelligent experiences.</p>

						<div className="mlai__chips" aria-label="Popular paradigms">
							<span className="mlai-chip">Transformer</span>
							<span className="mlai-chip">GNN</span>
							<span className="mlai-chip">Diffusion</span>
							<span className="mlai-chip">RL</span>
							<span className="mlai-chip">Foundation Models</span>
						</div>
				</div>
			</div>

					<div className="container mlai__list">
				<h2 className="mlai__section-title">Research publications</h2>
				<div className="mlai__cards">
							{data?.research_publications?.map((item, idx) => {
								// Attach lightweight previews (images) to create a richer feel.
								const previews = [
									{ type: "image", src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=60" },
									{ type: "image", src: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&auto=format&fit=crop&q=60" },
									{ type: "image", src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=60" },
								];
								return <SIGPublicationCard key={idx} {...item} preview={previews[idx % previews.length]} />;
							})}
				</div>
			</div>
		</section>
	);
}

