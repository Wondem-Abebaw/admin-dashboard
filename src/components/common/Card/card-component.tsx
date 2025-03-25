export interface CardProps {
  title: any;
  titleEmployerClassNames?: string;
  action?: any;
  children: any;
  className?: string;
  classNames?: { header: string; body: string };
}

export function Card(props: CardProps) {
  const {
    title,
    action,
    children,
    className,
    classNames,
    titleEmployerClassNames,
  } = props;
  // console.log("action", action)
  return (
    <div className={`h-full w-full border ${className}`}>
      <div
        className={`h-12 w-full px-2 border-0 border-b flex justify-between ${classNames?.header}`}
      >
        <div
          className={
            'h-full w-full flex dark:text-white items-center font-semibold ' +
            titleEmployerClassNames
          }
        >
          {title}
        </div>
        <div className="h-full flex items-center">{action}</div>
      </div>
      <div className={`${classNames?.body} p-2`}>{children}</div>
    </div>
  );
}
