import React, { useState } from "react";
import "./SIG-main.scss";

import SIGNav from "../../components/SIG-nav/SIGNav.jsx";
import MLAIPage from "../../components/MLAIPage/MLAIPage.jsx";
import BlockchainPage from "../../components/Blockchain/BlockchainPage.jsx";
import CybersecPage from "../../components/Cybersec/CybersecPage.jsx";
import OthersPage from "../../components/Others/OthersPage.jsx";

export default function SIGMain() {
	const [active, setActive] = useState("mlai");

	return (
		<main className="sig">
			{/* Secondary SIG navigation below the main nav */}
			<SIGNav defaultActive={active} onChange={setActive} />

			{/* Render the selected domain page; back buttons hidden when using subnav */}
			{active === "mlai" && <MLAIPage />}
			{active === "blockchain" && <BlockchainPage />}
			{active === "cybersec" && <CybersecPage />}
			{active === "others" && <OthersPage />}
		</main>
	);
}

