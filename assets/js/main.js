const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
	navToggle.addEventListener('click', () => {
		navLinks.classList.toggle('open');
	});

	navLinks.querySelectorAll('a').forEach(link => {
		link.addEventListener('click', () => {
			navLinks.classList.remove('open');
		});
	});
}

// Feature carousels
document.querySelectorAll('.feature-carousel').forEach(carousel => {
	const track = carousel.querySelector('.feature-screenshots');
	const prevBtn = carousel.querySelector('.carousel-prev');
	const nextBtn = carousel.querySelector('.carousel-next');

	if (!track || !prevBtn || !nextBtn) return;

	const getScrollAmount = () => {
		const img = track.querySelector('img');
		return img ? img.offsetWidth + 8 : 220;
	};

	const updateButtons = () => {
		const atStart = track.scrollLeft <= 2;
		const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
		prevBtn.classList.toggle('hidden', atStart);
		nextBtn.classList.toggle('hidden', atEnd);
	};

	prevBtn.addEventListener('click', () => {
		track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
	});

	nextBtn.addEventListener('click', () => {
		track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
	});

	track.addEventListener('scroll', updateButtons, { passive: true });

	// Initial state after images load
	window.addEventListener('load', updateButtons);
	updateButtons();
});

// Image modal / lightbox
(function () {
	const modal = document.createElement('div');
	modal.className = 'img-modal';
	modal.setAttribute('role', 'dialog');
	modal.setAttribute('aria-modal', 'true');
	modal.innerHTML = `
		<button class="img-modal-nav modal-prev" aria-label="Previous">&#8249;</button>
		<img class="img-modal-img" src="" alt="">
		<button class="img-modal-nav modal-next" aria-label="Next">&#8250;</button>
		<button class="img-modal-close" aria-label="Close">&#215;</button>
	`;
	document.body.appendChild(modal);

	const modalImg = modal.querySelector('.img-modal-img');
	const closeBtn = modal.querySelector('.img-modal-close');
	const prevBtn  = modal.querySelector('.modal-prev');
	const nextBtn  = modal.querySelector('.modal-next');

	let group = [];
	let currentIndex = 0;

	const updateModal = () => {
		modalImg.src = group[currentIndex].src;
		modalImg.alt = group[currentIndex].alt;
		prevBtn.classList.toggle('hidden', currentIndex === 0);
		nextBtn.classList.toggle('hidden', currentIndex === group.length - 1);
	};

	const open = (imgs, index) => {
		group = imgs;
		currentIndex = index;
		updateModal();
		modal.classList.add('open');
		document.body.style.overflow = 'hidden';
	};

	const close = () => {
		modal.classList.remove('open');
		document.body.style.overflow = '';
	};

	closeBtn.addEventListener('click', close);
	modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

	prevBtn.addEventListener('click', () => { currentIndex--; updateModal(); });
	nextBtn.addEventListener('click', () => { currentIndex++; updateModal(); });

	document.addEventListener('keydown', (e) => {
		if (!modal.classList.contains('open')) return;
		if (e.key === 'Escape') close();
		if (e.key === 'ArrowLeft'  && currentIndex > 0)               { currentIndex--; updateModal(); }
		if (e.key === 'ArrowRight' && currentIndex < group.length - 1) { currentIndex++; updateModal(); }
	});

	const selectors = '.screenshot-gallery img, .screenshot-grid img, .feature-screenshots img, .screenshot-sp-row img, .screenshot-full, .screenshot-mobile';

	document.querySelectorAll(selectors).forEach((img) => {
		img.addEventListener('click', () => {
			const siblings = Array.from(img.parentElement.querySelectorAll('img'));
			open(siblings, siblings.indexOf(img));
		});
	});
})();

// Scroll Reveal — fade-up sections as they enter the viewport
(function () {
	if (!('IntersectionObserver' in window)) return;

	const SELECTORS = [
		'main section > h2',
		'.main-about',
		'.skill-category',
		'.experience-card',
		'.edu-card',
		'.project-card',
		'.contact-card',
	];

	const els = Array.from(document.querySelectorAll(SELECTORS.join(', ')));

	// Group elements by their parent so siblings get staggered delays
	const groups = new Map();
	els.forEach(el => {
		const parent = el.parentElement;
		if (!groups.has(parent)) groups.set(parent, []);
		groups.get(parent).push(el);
	});

	groups.forEach(children => {
		children.forEach((el, i) => {
			el.classList.add('scroll-reveal');
			if (children.length > 1) {
				el.style.setProperty('--reveal-delay', `${i * 0.1}s`);
			}
		});
	});

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-visible');
				observer.unobserve(entry.target);
			}
		});
	}, { threshold: 0.12 });

	els.forEach(el => observer.observe(el));
})();