'use client';
import Image from 'next/image';
import ScrollAnimation from 'react-animate-on-scroll';

const MainBannerBackground = () => (
  <div className="hero-main-banner-image">
    <ScrollAnimation animateIn="fadeInDown" delay={50} animateOnce={true}>
      <Image
        width={341}
        height={400}
        src="/images/banner-image/man.png"
        alt="man"
      />
    </ScrollAnimation>

    <ScrollAnimation animateIn="fadeInUp" delay={50} animateOnce={true}>
      <Image
        width={174}
        height={111}
        src="/images/banner-image/code.png"
        alt="code"
      />
    </ScrollAnimation>

    <ScrollAnimation animateIn="fadeInLeft" delay={50} animateOnce={true}>
      <Image
        width={510}
        height={293}
        src="/images/banner-image/carpet.png"
        alt="carpet"
      />
    </ScrollAnimation>

    <ScrollAnimation animateIn="zoomIn" delay={50} animateOnce={true}>
      <Image
        width={86}
        height={112}
        src="/images/banner-image/bin.png"
        alt="bin"
      />
    </ScrollAnimation>

    <ScrollAnimation animateIn="bounceIn" delay={50} animateOnce={true}>
      <Image
        width={78}
        height={74}
        src="/images/banner-image/book.png"
        alt="book"
      />
    </ScrollAnimation>

    <ScrollAnimation animateIn="fadeInDown" delay={50} animateOnce={true}>
      <Image
        height={147}
        width={105}
        src="/images/banner-image/desktop.png"
        alt="desktop"
      />
    </ScrollAnimation>

    <ScrollAnimation animateIn="zoomIn" delay={50} animateOnce={true}>
      <Image
        width={94}
        height={70}
        src="/images/banner-image/dot.png"
        alt="dot"
      />
    </ScrollAnimation>

    <ScrollAnimation animateIn="fadeInUp" delay={50} animateOnce={true}>
      <Image
        width={78}
        height={291}
        src="/images/banner-image/flower-top-big.png"
        alt="flower-top-big"
      />
    </ScrollAnimation>

    <ScrollAnimation animateIn="rotateIn" delay={50} animateOnce={true}>
      <Image
        width={53}
        height={87}
        src="/images/banner-image/flower-top.png"
        alt="flower-top"
      />
    </ScrollAnimation>

    <ScrollAnimation animateIn="fadeInUp" delay={50} animateOnce={true}>
      <Image
        width={121}
        height={73}
        src="/images/banner-image/keyboard.png"
        alt="keyboard"
      />
    </ScrollAnimation>

    <ScrollAnimation animateIn="zoomIn" delay={50} animateOnce={true}>
      <Image
        width={42}
        height={77}
        src="/images/banner-image/pen.png"
        alt="pen"
      />
    </ScrollAnimation>

    <ScrollAnimation animateIn="zoomIn" delay={50} animateOnce={true}>
      <Image
        width={380}
        height={342}
        src="/images/banner-image/table.png"
        alt="table"
      />
    </ScrollAnimation>

    <ScrollAnimation animateIn="fadeInLeft" delay={50} animateOnce={true}>
      <Image
        width={44}
        height={104}
        src="/images/banner-image/tea-cup.png"
        alt="tea-cup"
      />
    </ScrollAnimation>

    <ScrollAnimation animateIn="rollIn" delay={50} animateOnce={true}>
      <Image
        width={62}
        height={62}
        src="/images/banner-image/headphone.png"
        alt="headphone"
      />
    </ScrollAnimation>
  </div>
);

export default MainBannerBackground;
