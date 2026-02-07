import Link from 'next/link';
import React, {
  Children,
  cloneElement,
  HTMLAttributes,
  isValidElement,
} from 'react';
import { usePathname } from 'next/navigation';

type Props = {
  children: React.ReactNode;
  activeClassName?: string;
  href: string;
};

const ActiveLink = ({ children, activeClassName, href, ...props }: Props) => {
  const pathname = usePathname();

  const childElements = Children.map(children, (child: React.ReactNode) => {
    if (!isValidElement(child)) {
      return child;
    }

    let className: string = child.props.className || '';

    // Check if current path matches the link href and apply active class
    if (pathname === href && activeClassName) {
      className = `${className} ${activeClassName}`.trim();
    }

    // Clone the element and pass the updated className
    return cloneElement(child, {
      className: className,
    } as HTMLAttributes<HTMLElement>);
  });

  return (
    <Link href={href} {...props}>
      {childElements}
    </Link>
  );
};

export default ActiveLink;
