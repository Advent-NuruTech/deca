"use client";

import { Heart } from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import HeroSection from "../HeroSection";
import SEO from "../SEO";

const AboutPage = () => (
  <>
    <SEO
      title="About Us | RemSam Homestead"
      description="Read the mission and convictions of the RemSam Homestead Family."
    />

    <HeroSection
      badge="Our Story"
      title="Rooted in <span class='text-emerald-600'>Faith</span>,<br />Growing Together"
      subtitle="Learn together with the RemSam Homestead Family through practical knowledge in homeschooling, agriculture, home making, health, and Biblical preparedness."
      primaryText="Read Our Mission"
      primaryLink="#mission"
      secondaryText="Get Involved"
      secondaryLink="/donate"
      imageSrc="/assets/about.jpeg"
      imageAlt="African mother homeschooling her children"
    />

    <section id="mission" className="bg-white py-20">
      <div className="container mx-auto px-4">
        <AnimatedSection delay={0.1} direction="up">
          <article className="mx-auto max-w-4xl rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-6 shadow-sm md:p-10">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                <Heart className="h-7 w-7 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Read Our Mission</h1>
            </div>

            <div className="space-y-5 text-[1.05rem] leading-8 text-gray-700">
              <p>Hello everyone. Blessings to you visiting this family website. This website does not represent any church’s views but personal convictions of the RemSam Homestead Family without fundamentally disagreeing with the Seventh-day Adventist Fundamental Principles of 1889.</p>

              <p>Our mission is to learn together and assist fellow pilgrims with practical knowledge in homeschooling, agriculture, home making and the preparedness for the Revelation 13 crisis. We hold to our heart dearly the Scripture in Hebrews 10:24, 25.</p>

              <blockquote className="rounded-2xl border-l-4 border-emerald-500 bg-white/80 p-5 italic text-gray-800 shadow-sm">
                “God&apos;s purpose in giving the third angel&apos;s message to the world is to prepare a people to stand true to Him during the investigative judgment. This is the purpose for which we establish and maintain our publishing houses, our schools, our sanitariums, hygienic restaurants, treatment rooms, and food factories. This is our purpose in carrying forward every line of work in the cause. Ms 154, 1902, p. 4. (&quot;Instruction to Men in Positions of Responsibility,&quot; October 24, 1902.)”
              </blockquote>

              <p>This website also has products that you may check and order. We are having a model farm which we try on these products and you can visit and be satisfied you’re acquiring genuine products.</p>

              <p>It is not our goal to solicit tithes and offerings. In the spirit of Spirit of Prophecy, we hold that:</p>

              <blockquote className="rounded-2xl border-l-4 border-amber-500 bg-white/80 p-5 italic text-gray-800 shadow-sm">
                “It is better to put confidence in the ministers of the conference where you live and in the officers of the church where you worship. Draw nigh to your brethren. Love them with a true heart fervently, and encourage them to bear their responsibilities faithfully in the fear of God. &quot;Be thou an example of the believers, in word, in conversation, in charity, in spirit, in faith, in purity&quot; [1 Timothy 4:12]. --Letter 96, 1911 (Published in The Early Elmshaven Years, p. 397.)”
              </blockquote>

              <p>This is the only way we can keep check of them when they do something wrong and can have a voice towards the right path. I can’t point out the problems in churches and conferences while am not faithful on my part to put confidence in them by faithfully returning tithes and offerings.</p>

              <p>Hence if there is any donation the visitor will be moved to make, it is upon them and they should specify exactly what it is for. We won’t reject any donation for it will help maintaining the website, printing non-commercial evangelism tracts for we run a publishing house and host training sessions in medical missionary work and workshops on Practical Biblical Christianity.</p>

              <p className="pt-2 font-semibold text-gray-900">Blessings<br />RemSam Homestead Family.</p>
            </div>
          </article>
        </AnimatedSection>
      </div>
    </section>
  </>
);

export default AboutPage;
