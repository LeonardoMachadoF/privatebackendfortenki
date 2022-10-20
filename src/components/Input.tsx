import styles from './styles.module.css';

interface Props {
    type: string;
    title: string;
    value: string | number;
    onChange: (e: any) => void;
    placeholder?: string;
}

export const Input = ({ type, title, value, onChange, placeholder }: Props) => {
    return (
        <div className={styles.container}>
            <label htmlFor={title} style={{ width: '130px' }}>
                {title}
            </label>
            <input placeholder={placeholder} required={title !== 'Titúlo do Capitulo'} type={type} id={title} value={value} onChange={e => onChange(e.target.value)} />
        </div>
    )
}