'use client';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DocumentData } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyBrdrmnQoGofCRdZLmU4OvsahThnexh4uc',
    authDomain: 'fir-form-87abc.firebaseapp.com',
    projectId: 'fir-form-87abc',
    storageBucket: 'fir-form-87abc.appspot.com',
    messagingSenderId: '624863567155',
    appId: '1:624863567155:web:b5b6e7597039c02d147246',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);

export default function Home() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [subscribers, setSubscribers] = useState<DocumentData[]>([]);
    const [name, setName] = useState('');

    const onSubmit = async (data: Record<string, any>) => {
        setIsSubmitting(true);

        try {
            const file = data.document[0];
            const storageRef = ref(storage, `cv/${file.name}`);
            await uploadBytes(storageRef, file);

            const downloadURL = await getDownloadURL(storageRef);

            const userData = {
                name: data.name,
                surname: data.surname,
                email: data.email,
                document: downloadURL,
            };

            await addDoc(collection(firestore, 'users'), userData);

            const snapshot = await getDocs(collection(firestore, 'users'));
            const subscriberList = snapshot.docs.map((doc) => doc.data());
            setSubscribers(subscriberList);
        } catch (error) {
            console.error(error);
        }

        setIsSubmitting(false);
        console.log(data);
    };

    return (
        <main className="container">
            <div className="form-wrapper">
                <div className="title">
                    <h1>Landing Page</h1>
                    <h2>Form</h2>
                </div>
                <form
                    className="form-wrapper"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {/* Name input */}
                    <div className="form-wrapper">
                        <label className="text" htmlFor="name">
                            Name
                        </label>
                        <input
                            id="name"
                            className="input"
                            {...register('name', { required: true })}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && <span>Please enter your name.</span>}
                    </div>

                    {/* Surname input */}
                    <div className="form-wrapper">
                        <label className="text" htmlFor="surname">
                            Surname
                        </label>
                        <input
                            id="surname"
                            className="input"
                            {...register('surname', { required: true })}
                        />
                        {errors.surname && (
                            <span>Please enter your surname.</span>
                        )}
                    </div>

                    {/* Email input */}
                    <div className="form-wrapper">
                        <label className="text" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            className="input"
                            {...register('email', {
                                required: true,
                                pattern: /^\S+@\S+$/i,
                            })}
                        />
                        {errors.email && (
                            <span>Please enter a valid email address.</span>
                        )}
                    </div>

                    {/* CV input */}
                    <div className="form-wrapper">
                        <label className="text" htmlFor="document">
                            CV
                        </label>
                        <input
                            id="document"
                            className="input"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            {...register('document', { required: true })}
                        />
                        {errors.document && <span>Please upload a CV.</span>}
                    </div>

                    {/* Submit button */}
                    <input
                        className="input-submit"
                        type="submit"
                        disabled={isSubmitting}
                        value={isSubmitting ? 'Submitting...' : 'Submit'}
                    />
                </form>
                <div className="switcher-box">
                    <div>Recibir notificaciones en mi email</div>
                    <label className="text switch">
                        <input type="checkbox" />
                        <span className="slider round"></span>
                    </label>
                </div>
                <div className="thanks-txt">
                    Thanks, {name} now upload your CV and click on the send
                    button. Once we receive your request, we will contact you as
                    soon as possible. You can check your status on our webpage.
                </div>
                {subscribers.length > 0 && (
                    <div>
                        <h2>Thanks, {name}</h2>
                        <h3>Subscribers:</h3>
                        <ul>
                            {subscribers.map((subscriber, index) => (
                                <li key={index}>{subscriber.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </main>
    );
}
