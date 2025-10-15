import React, { useState } from "react";
import "./SIG-main.scss";

import SIGNav from "../../components/SIG_comps/SIG-nav/SIGNav.jsx";
import MLAIPage from "../../components/SIG_comps/MLAIPage/MLAIPage.jsx";
import BlockchainPage from "../../components/SIG_comps/ComputerSystems/ComputerSystemsPage.jsx";
import CybersecPage from "../../components/SIG_comps/Cybersec/CybersecPage.jsx";
import OthersPage from "../../components/SIG_comps/TheoreticalCS/TheoreticalCS_Page.jsx";

export default function SIGMain() {
	const [active, setActive] = useState("mlai");

	return (
		<main className="sig">
			{/* Secondary SIG navigation below the main nav */}
			<SIGNav defaultActive={active} onChange={setActive} />

			{/* Render the selected domain page; back buttons hidden when using subnav */}
			{active === "mlai" && <MLAIPage />}
			{active === "systems" && <BlockchainPage />}
			{active === "infosec" && <CybersecPage />}
			{active === "theory" && <OthersPage />}
		</main>
	);
}

