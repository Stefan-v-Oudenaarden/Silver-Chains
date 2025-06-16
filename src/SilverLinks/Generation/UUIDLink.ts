import { signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilverLink, SilverLinkData } from 'src/services/links.service';
import { CustomSilverLink } from '../CustomSilverLinks';
import { v1 as uuidv1, v3 as uuidv3, v4 as uuidv4, v5 as uuidv5, v6 as uuidv6, v7 as uuidv7 } from 'uuid';
import { JoinedString } from 'src/app/helpers';

export class UUIDLink extends CustomSilverLink {
  override Name = 'UUID';
  override Category = 'Generation';
  override Description = "Generate one or more UUID's in a specified format.";

  override HasSettings = true;
  override ShowSettings = signal<boolean>(true);
  override Settings: {
    Append: boolean;
    Type: string;
    Amount: number;
    Namespace?: string;
  } = {
    Append: false,
    Type: 'uuidv4',
    Amount: 1,
    Namespace: '',
  };

  override SettingsFormOptions = undefined;
  override SettingsForm: FormlyFieldConfig[] = [
    {
      key: 'Append',
      type: 'checkbox',
      defaultValue: false,
      props: {
        label: 'Append instead of overwrite?',
        required: false,
      },
    },
    {
      key: 'Amount',
      type: 'number',
      defaultValue: 1,
      props: {
        label: 'How many IDs',
        required: false,
        min: 1,
        max: 100,
      },
    },
    {
      key: 'Type',
      type: 'select',
      defaultValue: 'uuidv4',
      props: {
        label: 'UUID Type',
        required: false,
        options: [
          { label: 'UUID V1 (Timestamp + MAC)', value: 'uuidv1' },
          { label: 'UUID V3 (MD5 Hash)', value: 'uuidv3' },
          { label: 'UUID V4 (Random)', value: 'uuidv4' },
          { label: 'GUID', value: 'guid' },
          { label: 'UUID V5 (SHA-1 Hash)', value: 'uuidv5' },
          { label: 'UUID V6 (Timestamp + MAC, Reordered)', value: 'uuidv6' },
          { label: 'UUID V7 (Unix Timestamp + Random)', value: 'uuidv7' },
        ],
      },
    },
    {
      key: 'Namespace',
      type: 'select',
      defaultValue: 'dns',
      props: {
        label: 'Namespace (for V3/V5)',
        required: false,
        options: [
          { label: 'DNS Namespace', value: 'dns' },
          { label: 'URL Namespace', value: 'url' },
          { label: 'OID Namespace', value: 'oid' },
          { label: 'X500 Namespace', value: 'x500' },
          { label: 'Random UUID Namespace', value: 'random' },
        ],
        description: 'Namespace to use for UUID V3 and V5. Random data will be generated automatically.',
      },
      expressions: {
        hide: 'model.Type !== "uuidv3" && model.Type !== "uuidv5"',
      },
    },
  ];

  // Predefined namespaces as per RFC 4122
  private readonly DNS_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
  private readonly URL_NAMESPACE = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
  private readonly OID_NAMESPACE = '6ba7b812-9dad-11d1-80b4-00c04fd430c8';
  private readonly X500_NAMESPACE = '6ba7b814-9dad-11d1-80b4-00c04fd430c8';

  public override Run(Input: SilverLinkData): SilverLinkData {
    let uuids: string[] = [];

    try {
      for (let i = 0; i < this.Settings.Amount; i++) {
        switch (this.Settings.Type) {
          case 'uuidv1':
            uuids.push(uuidv1());
            break;

          case 'uuidv3':
            const v3Namespace = this.resolveNamespace(this.Settings.Namespace || 'dns');
            const v3RandomData = this.generateRandomData();
            uuids.push(uuidv3(v3RandomData, v3Namespace));
            break;

          case 'uuidv4':
            uuids.push(uuidv4());
            break;

          case 'uuidv5':
            const v5Namespace = this.resolveNamespace(this.Settings.Namespace || 'dns');
            const v5RandomData = this.generateRandomData();
            uuids.push(uuidv5(v5RandomData, v5Namespace));
            break;

          case 'uuidv6':
            uuids.push(uuidv6());
            break;

          case 'uuidv7':
            uuids.push(uuidv7());
            break;

          case 'guid':
            uuids.push(`{${uuidv4().toUpperCase()}}`);
            break;

          default:
            uuids.push(uuidv4()); // fallback to uuidv4
            break;
        }
      }
    } catch (error) {
      // If there's an error, return error message
      return new SilverLinkData(`Error generating UUID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    let uuidsString = uuids.join('\n');

    if (this.Settings.Append) {
      let original = '';
      if (Input.DataFields.length > 0 && Input.DataFields[0].Text !== undefined) {
        original = Input.DataFields[0].Text;
      }

      return new SilverLinkData(JoinedString(original, uuidsString, '\n'));
    }

    return new SilverLinkData(uuidsString);
  }

  private generateRandomData(): string {
    const timestamp = Date.now().toString();
    const randomNum = Math.random().toString(36).substring(2);
    const randomString = Math.random().toString(36).substring(2, 15);

    // Combine various random elements to create unique data each time
    return `${timestamp}-${randomNum}-${randomString}-${Math.floor(Math.random() * 1000000)}`;
  }

  private resolveNamespace(namespace: string): string {
    // Check for predefined namespace keywords
    switch (namespace.toLowerCase()) {
      case 'dns':
        return this.DNS_NAMESPACE;
      case 'url':
        return this.URL_NAMESPACE;
      case 'oid':
        return this.OID_NAMESPACE;
      case 'x500':
        return this.X500_NAMESPACE;
      case 'random':
        return uuidv4(); // Generate a random namespace UUID
      default:
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(namespace)) {
          return namespace;
        }

        return this.DNS_NAMESPACE;
    }
  }

  public override New(): SilverLink {
    return new UUIDLink();
  }
}
