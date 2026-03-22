import logoSrc from "../assets/proje-birlik-logo.png";

/**
 * Verdiğiniz şeffaf PNG — tek kaynak: `src/assets/proje-birlik-logo.png` (import ile doğrudan kullanım).
 */
const AppLogo = ({ className = "", alt = "Proje Birlik", ...rest }) => (
	<span className='inline-block bg-transparent'>
		<img
			src={logoSrc}
			alt={alt}
			decoding='async'
			draggable={false}
			className={`block object-contain select-none bg-transparent ${className}`}
			{...rest}
		/>
	</span>
);

export default AppLogo;
