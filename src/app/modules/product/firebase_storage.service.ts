import { Bucket } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

@Injectable()
export class FirebaseStorageService {
  public bucket: Bucket;

  constructor() {
    const app = initializeApp({
      credential: credential.cert({
        clientEmail:
          'firebase-adminsdk-o2gss@ecommerce-clone-33c10.iam.gserviceaccount.com',
        privateKey:
          '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC8RThOQLkZ+wbw\n/dkyTi8vvIb9rIreQuZHiElFZqGp85YzM7LDDIkRUoOHxoNLcwk8skgcPf6Rc/9j\nVI/wAJ0ZR4o5g0cNR1xNYFKAWwnTwo3UslAYcUNcHFLC0qv1vWoeqdzwQjFu/dSV\ny9FB2l5J5DUqytgaZWcAQkbEkh5E26d6PRHQVoLEFfvHcvzvodpenamOvqNQElBW\nD8sj1MXZrGSDHEC77984ou7HZjaBWVnpl17I/7583UF1G03xBRfnGkMyxc3StVWZ\nYxQMcfuEGwdv3+BRKT2r0KrSu5Gpnsl5n+VE/2JZdIcx8+HkCgL559MeaEpDo8jB\nAHm1LnHJAgMBAAECggEAEVGaG7NfKQFV4swB3jDMV8B9986Wz69Tw6IegLXaNT9l\nF7yvuxA8zk0gMFiV3KuZCUOqgn6UG7PnUFndC8o3/rVSr8u1uNum+q8w/QG4O7Sa\nm3BJEevesxXKlIVmBYBbx1+qJVJ8KFD37KJdKN5Pl3iDXjZeqWmej1WJcQJdVR6+\n+cM4h3Mk2Br9axs/tm4Qc3V3TgI5ojxo8Ni8IhetS2vFjp2Gcta9Xnt5sfmcxJmx\n8EzAAfiPeOwKlgrDA6ag2WUufuxTVyVIqP6j4EJo0QcxmK3MdRwzQlrRzS4o31W5\nkR5sClHoIEq9ukio65q1tjr/xEludhc86DMrWHH8qQKBgQD1q5Cp0A/b+wAgFsuB\nmQABnW1CqMEF+v3ldfSahzPnYWB8Evf9Vkw6efl1kbPAm1l8gYjnYPFEYGM3uvfr\nesXXdtpHytpJWYSEQ6+KOefVVx6L3jety1tpUa9Vv5/A2JC2lbcWTr1G35Njqa4d\n0oJxR1sj/dzuZwrWCAeEqSUt9wKBgQDEL8tAOfvnG4des22yPlo3ISHnTYmP5Oq5\nhYfTx3fgAjOwvMkIwNRMVwO3M7AxS9YV/yuG46idqUdp6w5OWEhnFFtj1YbPfKVu\nd538hXhMBUvdCvzSZxbEP7biFS1HvJcjDBvit/OzQvN7eUfPRIe2HqkUDSiHKq/d\nUP1WDPhuPwKBgAtrC/A4kWQiCGF1bcP6PnvUu01L1pzWi5Jspw+/lPP+HKPnpcsK\nhcR6AtQqD3a2QbR9uMU4Rj5tVG80q20waZ2YEpEfpoGePYCAPNpp0pKh1/OcQm47\nc2Yzu7h6jYxDBIbX8oiA5F806P7K1iLgs9tb+6pylCAofeJwwRizW90FAoGAMlFz\n1whINLFZ2g85PnNBnkwwLuwzMSXskiLOgKHzfA/0hAsXoNgcW2wh9tYaBbrGsSOe\nXV18vNtTBraUF8IK5+1Pt15n0kXNBHVHnyH4hb8CAzKzP5/TNgiFdp0p3PFg7ktH\nx7GYnsy4OF4V7fJMwIhCo3LwhyKKsr/4Ch8PhO8CgYAYCUkhgxOnaI7lFuPFDhb/\nkCHXsk1oGkkcb4iidkcXuNGG/myiPDYTNyGnybQTBphm6d7QHYg81SfS+fxVtcgb\n0FcyS49yJWOIaXG9IkcYWmAtt9w3OW5njHW4Dst6NfrACt3+23xZ+k3x+FlWHRXG\nfx7LV4Xqmdyk4OAKZ4/FEQ==\n-----END PRIVATE KEY-----\n',
        projectId: 'ecommerce-clone-33c10',
      }),
      storageBucket: 'gs://ecommerce-clone-33c10.appspot.com',
    });

    this.bucket = getStorage(app).bucket();
  }
}
