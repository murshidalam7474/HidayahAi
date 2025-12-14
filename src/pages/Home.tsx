import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Book, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";
import mysticalBg from "@/assets/mystical-bg.png";

const islamicQuotes = [
	{
		text: "And We have certainly made the Quran easy for remembrance, so is there any who will remember?",
		source: "Quran 54:17",
	},
	{
		text: "Indeed, Allah is with those who fear Him and those who are doers of good.",
		source: "Quran 16:128",
	},
	{ text: "So verily, with the hardship, there is relief.", source: "Quran 94:5" },
	{
		text: "And whoever relies upon Allah – then He is sufficient for him.",
		source: "Quran 65:3",
	},
	{
		text: "The best among you are those who have the best manners and character.",
		source: "Sahih Bukhari",
	},
	{ text: "Speak good or remain silent.", source: "Sahih Bukhari" },
	{ text: "Be in this world as if you were a stranger or a traveler.", source: "Sahih Bukhari" },
	{
		text: "The strong is not the one who overcomes people by his strength, but the strong is the one who controls himself while in anger.",
		source: "Sahih Bukhari",
	},
	{
		text: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
		source: "Sahih Muslim",
	},
	{
		text: "None of you truly believes until he loves for his brother what he loves for himself.",
		source: "Sahih Bukhari",
	},
	{
		text: "The most beloved deed to Allah is the most regular and constant even if it were little.",
		source: "Sahih Bukhari",
	},
	{ text: "And say: My Lord, increase me in knowledge.", source: "Quran 20:114" },
	{
		text: "Indeed, the mercy of Allah is near to the doers of good.",
		source: "Quran 7:56",
	},
	{ text: "Call upon Me; I will respond to you.", source: "Quran 40:60" },
	{ text: "And He found you lost and guided you.", source: "Quran 93:7" },
];

const Home = () => {
	const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
	const [isQuoteVisible, setIsQuoteVisible] = useState(true);

	useEffect(() => {
		const interval = setInterval(() => {
			setIsQuoteVisible(false);
			setTimeout(() => {
				setCurrentQuoteIndex((prev) => (prev + 1) % islamicQuotes.length);
				setIsQuoteVisible(true);
			}, 500);
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	const quickLinks = [
		{
			title: "Quran",
			description: "Read and listen to the Holy Quran",
			icon: BookOpen,
			href: "/quran",
			gradient: "from-purple-600 to-blue-600",
		},
		{
			title: "Hadith",
			description: "Explore authentic Hadith collections",
			icon: Book,
			href: "/hadith",
			gradient: "from-blue-600 to-indigo-600",
		},
		{
			title: "AI Chat",
			description: "Ask questions about Islam",
			icon: MessageSquare,
			href: "/chat",
			gradient: "from-indigo-600 to-purple-600",
		},
		{
			title: "About Dev",
			description: "Learn about the developer",
			icon: User,
			href: "/about",
			gradient: "from-purple-600 to-pink-600",
		},
	];

	return (
		<div className="min-h-screen relative overflow-hidden">
			{/* Mystical Background with Celestial Animation */}
			<div
				className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-[celestial-breathe_8s_ease-in-out_infinite]"
				style={{ backgroundImage: `url(${mysticalBg})` }}
			/>

			{/* Floating Stars */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{[...Array(20)].map((_, i) => (
					<div
						key={i}
						className="absolute w-1 h-1 bg-white rounded-full animate-[twinkle_3s_ease-in-out_infinite]"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 3}s`,
							opacity: 0.3 + Math.random() * 0.5,
						}}
					/>
				))}
			</div>

			{/* Shooting Stars */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{[...Array(5)].map((_, i) => (
					<div
						key={`shooting-${i}`}
						className="absolute w-1 h-1 bg-white rounded-full animate-[shooting-star_3s_linear_infinite]"
						style={{
							left: `${10 + i * 20}%`,
							top: `${5 + i * 10}%`,
							animationDelay: `${i * 2}s`,
						}}
					/>
				))}
			</div>

			{/* Celestial Glow Orbs */}
			<div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]" />
			<div className="absolute bottom-40 right-20 w-40 h-40 bg-emerald-500/15 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite_reverse]" />
			<div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite]" />

			<div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background/80" />

			<div className="container mx-auto px-4 py-20 relative z-10">
				{/* Hero Section with Arabic Greeting */}
				<div className="text-center mb-20 space-y-4">
					{/* Arabic Greeting */}
					<h2 className="text-5xl md:text-7xl font-arabic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-yellow-300 to-emerald-400 animate-fade-in drop-shadow-lg">
						ٱلسَّلَامُ عَلَيْكُمْ
					</h2>
					<p className="text-lg text-muted-foreground/80 tracking-widest">
						Peace be upon you
					</p>

					<h1 className="text-5xl md:text-7xl font-bold mt-6">
						<span className="text-foreground">Welcome to </span>
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">
							HidayahAI
						</span>
					</h1>
					<p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
						Your comprehensive Islamic companion powered by AI. Explore the Holy
						Quran, authentic Hadith, inspiring quotes, and get guided answers to
						your Islamic questions.
					</p>

					{/* CTA Buttons */}
					<div className="flex items-center justify-center gap-4 mt-8">
						<Link to="/quran">
							<Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg rounded-full">
								<BookOpen className="w-5 h-5 mr-2" />
								Read Quran
							</Button>
						</Link>
						<Link to="/chat">
							<Button className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-6 text-lg rounded-full animate-[glow_1.5s_ease-in-out_infinite]">
								Chat
							</Button>
						</Link>
					</div>
				</div>

				{/* Quick Links Grid */}
				<div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
					{quickLinks.map((link) => (
						<Link key={link.href} to={link.href}>
							<Card className="card-glass p-8 hover:scale-105 transition-all duration-300 cursor-pointer group backdrop-blur-md bg-background/30 border-border/30">
								<div
									className={`w-16 h-16 rounded-xl bg-gradient-to-br ${link.gradient} flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow`}
								>
									<link.icon className="w-8 h-8 text-white" />
								</div>
								<h2 className="text-2xl font-bold mb-2">{link.title}</h2>
								<p className="text-muted-foreground">
									{link.description}
								</p>
							</Card>
						</Link>
					))}
				</div>

				{/* Dynamic Islamic Quotes */}
				<div className="mt-16 max-w-3xl mx-auto">
					<Card className="card-glass p-8 backdrop-blur-md bg-background/30 border-border/30 text-center">
						<div
							className={`transition-all duration-500 ${
								isQuoteVisible
									? "opacity-100 translate-y-0"
									: "opacity-0 translate-y-2"
							}`}
						>
							<p className="text-lg md:text-xl italic text-foreground/90 leading-relaxed">
								"{islamicQuotes[currentQuoteIndex].text}"
							</p>
							<p className="text-sm text-emerald-400 mt-4 font-medium">
								— {islamicQuotes[currentQuoteIndex].source}
							</p>
						</div>

						{/* Progress dots */}
						<div className="flex justify-center gap-1.5 mt-6">
							{islamicQuotes.map((_, index) => (
								<div
									key={index}
									className={`h-1.5 rounded-full transition-all duration-300 ${
										index === currentQuoteIndex
											? "bg-emerald-400 w-4"
											: "bg-white/30 w-1.5"
									}`}
								/>
							))}
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default Home;
