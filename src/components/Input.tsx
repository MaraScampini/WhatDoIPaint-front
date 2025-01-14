interface InputProps {
    type: string,
    name: string,
    placeholder?: string,
    value: string | number,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    maxLength?: number,
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
    classNames?: string
}

const Input = ({ type, name, placeholder, value, onChange, maxLength, onBlur, classNames } : InputProps) => {
    return (
        <div className="w-full py-3">
            <p className="font-display text-lightTeal uppercase font-light pb-1">{name}</p>
            <input
                className={'font-display text-offWhite bg-darkGrey h-10 rounded-md px-3 w-full ' + classNames}
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                maxLength={maxLength}
                onBlur={onBlur}
            />
        </div>
    )
}

export default Input